'use strict'

const ecomUtils = require('@ecomplus/utils')

const validateDateRange = rule => {
  // filter campaings by date
  const timestamp = Date.now()
  if (rule.date_range) {
    if (rule.date_range.start && new Date(rule.date_range.start).getTime() > timestamp) {
      return false
    }
    if (rule.date_range.end && new Date(rule.date_range.end).getTime() < timestamp) {
      return false
    }
  }
  return true
}

const validateCustomerId = (rule, params) => {
  if (
    Array.isArray(rule.customer_ids) &&
    rule.customer_ids.length &&
    rule.customer_ids.indexOf(params.customer && params.customer._id) === -1
  ) {
    // unavailable for current customer
    return false
  }
  return true
}

const checkOpenPromotion = rule => {
  return !rule.discount_coupon && !rule.utm_campaign &&
    (!Array.isArray(rule.customer_ids) || !rule.customer_ids.length)
}

// check for category
const checkCategoryId = (campaignCategories, item) => {
  console.log('Categorias que chegaram', JSON.stringify(campaignCategories))
  console.log('item', JSON.stringify(item))
  const { categories } = item
  if (Array.isArray(categories) && categories.length && Array.isArray(campaignCategories) && campaignCategories.length) {
    categories.some(category => {
      return (campaignCategories.indexOf(category._id) > -1)
    }) 
  }
  return true
}

const getValidDiscountRules = (discountRules, params, items) => {
  if (Array.isArray(discountRules) && discountRules.length) {
    // validate rules objects
    return discountRules.filter(rule => {
      if (!rule || !validateCustomerId(rule, params)) {
        return false
      }

      if ((Array.isArray(rule.product_ids) || Array.isArray(rule.category_ids)) && Array.isArray(items)) {
        const checkProductId = item => {
          return (!rule.product_ids.length || rule.product_ids.indexOf(item.product_id) > -1)
        }
        // set/add discount value from lowest item price
        let value
        if (rule.discount_lowest_price) {
          items.forEach(item => {
            const price = ecomUtils.price(item)
            if (price > 0 && checkProductId(item) && (!value || value > price) && checkCategoryId(rule.category_ids, item)) {
              value = price
            }
          })
        } else if (rule.discount_kit_subtotal) {
          value = 0
          items.forEach(item => {
            const price = ecomUtils.price(item)
            if (price > 0 && checkProductId(item) && checkCategoryId(rule.category_ids, item)) {
              value += price * item.quantity
            }
          })
          console.log('discount from kit only', value)
        }
        if (value) {
          console.log('Show me the rule', JSON.stringify(rule))
          if (rule.discount && rule.discount.value) {
            if (rule.discount.type === 'percentage') {
              value *= rule.discount.value / 100
            } else {
              if (rule.discount_kit_subtotal) {
                value = rule.discount.value
              } else {
                value = Math.min(value, rule.discount.value)
              }
            }
          }

          rule.originalDiscount = rule.discount
          rule.discount = {
            ...rule.discount,
            type: 'fixed',
            value
          }
        }
      }
      if (!rule.discount || !rule.discount.value) {
        return false
      }

      return validateDateRange(rule)
    })
  }

  // returns array anyway
  return []
}

const matchDiscountRule = (discountRules, params) => {
  // try to match a promotion
  if (params.discount_coupon) {
    // match only by discount coupon
    return {
      discountRule: discountRules.find(rule => {
        return rule.case_insensitive
          ? typeof rule.discount_coupon === 'string' &&
            rule.discount_coupon.toUpperCase() === params.discount_coupon.toUpperCase()
          : rule.discount_coupon === params.discount_coupon
      }),
      discountMatchEnum: 'COUPON'
    }
  }

  // try to match by UTM campaign first
  if (params.utm && params.utm.campaign) {
    const discountRule = discountRules.find(rule => {
      return rule.case_insensitive
        ? typeof rule.utm_campaign === 'string' &&
          rule.utm_campaign.toUpperCase() === params.utm.campaign.toUpperCase()
        : rule.utm_campaign === params.utm.campaign
    })
    if (discountRule) {
      return {
        discountRule,
        discountMatchEnum: 'UTM'
      }
    }
  }

  // then try to match by customer
  if (params.customer && params.customer._id) {
    const discountRule = discountRules.find(rule => Array.isArray(rule.customer_ids) &&
      rule.customer_ids.indexOf(params.customer._id) > -1)
    if (discountRule) {
      return {
        discountRule,
        discountMatchEnum: 'CUSTOMER'
      }
    }
  }

  // last try to match by open promotions
  return {
    discountRule: discountRules.find(checkOpenPromotion),
    discountMatchEnum: 'OPEN'
  }
}

const checkCampaignProducts = (campaignProducts, params, campaignCategories) => {
  let hasProductMatch
  if (Array.isArray(campaignProducts) && campaignProducts.length) {
    // must check at least one campaign product on cart
    if (params.items && params.items.length) {
      for (let i = 0; i < campaignProducts.length; i++) {
        if (params.items.find(item => item.quantity && item.product_id === campaignProducts[i]) && checkCategoryId(campaignCategories, item)) {
          hasProductMatch = true
          break
        }
      }
    }
    if (!hasProductMatch) {
      return false
    }
  } else if (Array.isArray(campaignCategories) && campaignCategories.length) {
    // must check at least one campaign product on cart
    if (params.items && params.items.length) {
      for (let i = 0; i < campaignCategories.length; i++) {
        if (params.items.find(item => item.quantity && checkCategoryId(campaignCategories, item))) {
          hasProductMatch = true
          break
        }
      }
    }
    if (!hasProductMatch) {
      return false
    }
  }
  return true
}

module.exports = {
  validateDateRange,
  validateCustomerId,
  checkOpenPromotion,
  getValidDiscountRules,
  matchDiscountRule,
  checkCampaignProducts
}
