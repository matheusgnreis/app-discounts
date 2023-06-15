/* eslint-disable comma-dangle, no-multi-spaces, key-spacing */

/**
 * Edit base E-Com Plus Application object here.
 * Ref.: https://developers.e-com.plus/docs/api/#/store/applications/
 */

const app = {
  app_id: 101537,
  title: 'Campanhas e descontos de Teste',
  slug: 'campanhas-e-descontos',
  type: 'external',
  state: 'active',
  authentication: true,

  /**
   * Uncomment modules above to work with E-Com Plus Mods API on Storefront.
   * Ref.: https://developers.e-com.plus/modules-api/
   */
  modules: {
    /**
     * Triggered to calculate shipping options, must return values and deadlines.
     * Start editing `routes/ecom/modules/calculate-shipping.js`
     */
    // calculate_shipping:   { enabled: true },

    /**
     * Triggered to validate and apply discount value, must return discount and conditions.
     * Start editing `routes/ecom/modules/apply-discount.js`
     */
    apply_discount:       { enabled: true },

    /**
     * Triggered when listing payments, must return available payment methods.
     * Start editing `routes/ecom/modules/list-payments.js`
     */
    // list_payments:        { enabled: true },

    /**
     * Triggered when order is being closed, must create payment transaction and return info.
     * Start editing `routes/ecom/modules/create-transaction.js`
     */
    // create_transaction:   { enabled: true },
  },

  /**
   * Uncomment only the resources/methods your app may need to consume through Store API.
   */
  auth_scope: {
    'stores/me': [
      'GET'            // Read store info
    ],
    procedures: [
      'POST'           // Create procedures to receive webhooks
    ],
    products: [
      // 'GET',           // Read products with public and private fields
      // 'POST',          // Create products
      // 'PATCH',         // Edit products
      // 'PUT',           // Overwrite products
      // 'DELETE',        // Delete products
    ],
    brands: [
      // 'GET',           // List/read brands with public and private fields
      // 'POST',          // Create brands
      // 'PATCH',         // Edit brands
      // 'PUT',           // Overwrite brands
      // 'DELETE',        // Delete brands
    ],
    categories: [
      // 'GET',           // List/read categories with public and private fields
      // 'POST',          // Create categories
      // 'PATCH',         // Edit categories
      // 'PUT',           // Overwrite categories
      // 'DELETE',        // Delete categories
    ],
    customers: [
      // 'GET',           // List/read customers
      // 'POST',          // Create customers
      // 'PATCH',         // Edit customers
      // 'PUT',           // Overwrite customers
      // 'DELETE',        // Delete customers
    ],
    orders: [
      'GET',           // List/read orders with public and private fields
      // 'POST',          // Create orders
      // 'PATCH',         // Edit orders
      // 'PUT',           // Overwrite orders
      // 'DELETE',        // Delete orders
    ],
    carts: [
      // 'GET',           // List all carts (no auth needed to read specific cart only)
      // 'POST',          // Create carts
      // 'PATCH',         // Edit carts
      // 'PUT',           // Overwrite carts
      // 'DELETE',        // Delete carts
    ],

    /**
     * Prefer using 'fulfillments' and 'payment_history' subresources to manipulate update order status.
     */
    'orders/fulfillments': [
      // 'GET',           // List/read order fulfillment and tracking events
      // 'POST',          // Create fulfillment event with new status
      // 'DELETE',        // Delete fulfillment event
    ],
    'orders/payments_history': [
      // 'GET',           // List/read order payments history events
      // 'POST',          // Create payments history entry with new status
      // 'DELETE',        // Delete payments history entry
    ],

    /**
     * Set above 'quantity' and 'price' subresources if you don't need access for full product document.
     * Stock and price management only.
     */
    'products/quantity': [
      // 'GET',           // Read product available quantity
      // 'PUT',           // Set product stock quantity
    ],
    'products/variations/quantity': [
      // 'GET',           // Read variaton available quantity
      // 'PUT',           // Set variation stock quantity
    ],
    'products/price': [
      // 'GET',           // Read product current sale price
      // 'PUT',           // Set product sale price
    ],
    'products/variations/price': [
      // 'GET',           // Read variation current sale price
      // 'PUT',           // Set variation sale price
    ],

    /**
     * You can also set any other valid resource/subresource combination.
     * Ref.: https://developers.e-com.plus/docs/api/#/store/
     */
  },

  admin_settings: {
    discount_rules: {
      schema: {
        title: 'Regras de desconto',
        description: 'Aplicar descontos com filtros por cupom, campanha UTM e/ou cliente. Para importação em massa, verifique a tabela https://bit.ly/3zRvONd',
        type: 'array',
        items: {
          type: 'object',
          title: 'Regra de desconto',
          required: [
            'discount'
          ],
          additionalProperties: false,
          properties: {
            label: {
              type: 'string',
              maxLength: 100,
              title: 'Rótulo',
              description: 'Título (opcional) da promoção'
            },
            description: {
              type: 'string',
              maxLength: 1000,
              title: 'Descrição',
              description: 'Texto com informações adicionais sobre a promoção'
            },
            date_range: {
              type: 'object',
              title: 'Período de validade',
              description: 'Preencha para programar a oferta a datas de início e/ou fim',
              additionalProperties: false,
              properties: {
                start: {
                  type: 'string',
                  format: 'date-time',
                  title: 'Início'
                  },
                end: {
                  type: 'string',
                  format: 'date-time',
                  title: 'Encerramento'
                  }
                }
            },
          discount_coupon: {
            type: 'string',
            maxLength: 255,
            title: 'Cupom de desconto',
            description: 'Se preenchido, o desconto será aplicado apenas com a inserção do cupom'
            },
          utm_campaign: {
            title: 'Campanha UTM',
            description: 'Preencha para aplicar o desconto por campanha UTM (`utm_campaign`)',
            type: 'string',
            maxLength: 200
            },
          case_insensitive: {
            type: 'boolean',
            title: 'Case insensitive',
            description: 'Ative para não diferenciar letras maiúsculas e minúsculas no cupom ou campanha'
            },
          usage_limit: {
            type: 'integer',
            minimum: 1,
            maximum: 1000,
            title: 'Limite de uso por cliente',
            description: 'Limite opcional de aplicação do desconto para cada cliente'
            },
          total_usage_limit: {
            type: 'integer',
            minimum: 1,
            maximum: 1000,
            title: 'Limite de uso total',
            description: 'Limite opcional de aplicação do desconto até desativá-lo'
            },
          customer_ids: {
            title: 'Lista de clientes selecionados',
            description: 'Se preenchido, o desconto será disponibilizado apenas para estes clientes',
            type: 'array',
            items: {
              type: 'string',
              pattern: '^[a-f0-9]{24}$',
              title: 'ID do cliente'
              }
            },
          discount: {
            title: 'Desconto concedido',
            type: 'object',
            required: [
              'value'
              ],
            additionalProperties: false,
            properties: {
              apply_at: {
                type: 'string',
                enum: [
                  'total',
                  'subtotal',
                  'freight'
                  ],
                default: 'total',
                title: 'Aplicar desconto em',
                description: 'Em qual valor o desconto deverá ser aplicado no checkout'
                },
              min_amount: {
                type: 'integer',
                minimum: 1,
                maximum: 999999999,
                title: 'Valor mínimo',
                description: 'Montante mínimo para aplicar o desconto'
                },
              amount_field: {
                type: 'string',
                enum: [
                  'total',
                  'subtotal'
                  ],
                default: 'total',
                title: 'Montante a validar',
                description: 'Checar valor mínimo no total ou subtotal do carrinho'
                },
              type: {
                type: 'string',
                enum: [
                  'percentage',
                  'fixed'
                  ],
                default: 'fixed',
                title: 'Tipo de desconto',
                description: 'Desconto com valor percentual ou fixo'
                },
              value: {
                type: 'number',
                minimum: -99999999,
                maximum: 99999999,
                title: 'Valor do desconto',
                description: 'Valor percentual ou fixo a ser descontado, dependendo to tipo configurado'
                }
              }
            },
          product_ids: {
            title: 'Lista de produtos da campanha',
            description: 'Se preenchido, o desconto só será válido se um dos produtos estiver no carrinho',
            type: 'array',
            items: {
              type: 'string',
              pattern: '^[a-f0-9]{24}$',
              title: 'ID do produto'
              }
            },
            category_ids: {
              title: 'Lista de categorias da campanha',
              description: 'Se preenchido, o desconto só será válido se um dos produtos tiver a categoria estiver no carrinho',
              type: 'array',
              items: {
                type: 'string',
                pattern: '^[a-f0-9]{24}$',
                title: 'ID da categoria'
                }
              },
          excluded_product_ids: {
            title: 'Produtos excluídos',
            description: 'Se preenchido, o desconto será inválido se um dos produtos estiver no carrinho',
            type: 'array',
            items: {
              type: 'string',
              pattern: '^[a-f0-9]{24}$',
              title: 'ID do produto'
              }
            },
          cumulative_discount: {
            type: 'boolean',
            default: true,
            title: 'Desconto cumulativo',
            description: 'Se a promoção poderá ser aplicada junto a descontos de pagamento/entrega'
            }
          }
        }
      },
    hide: true
    },
  product_kit_discounts: {
    schema: {
      title: 'Descontos \'compre junto\'',
      description: 'Aplicar descontos por quantidade ou kits de produto(s). Para importação em massa, verifique a tabela https://bit.ly/2XikNGO',
      type: 'array',
      items: {
        type: 'object',
        title: 'Desconto por kit',
        required: [
          'product_ids'
          ],
        additionalProperties: false,
        properties: {
          label: {
            type: 'string',
            maxLength: 100,
            title: 'Rótulo',
            description: 'Título (opcional) da promoção'
            },
          date_range: {
            type: 'object',
            title: 'Período de validade',
            description: 'Preencha para programar a oferta a datas de início e/ou fim',
            additionalProperties: false,
            properties: {
              start: {
                type: 'string',
                format: 'date-time',
                title: 'Início'
                },
              end: {
                type: 'string',
                format: 'date-time',
                title: 'Encerramento'
                }
              }
            },
          product_ids: {
            title: 'Lista de produtos do kit',
            description: 'Produtos compondo o kit para desconto \'compre junto\' ou \'leve X pague Y\'',
            type: 'array',
            items: {
              type: 'string',
              pattern: '^[a-f0-9]{24}$',
              title: 'ID do produto'
              }
            },
            category_ids: {
              title: 'Lista de categorias da campanha',
              description: 'Se preenchido, o desconto só será válido se um dos produtos tiver a categoria e estiver no carrinho',
              type: 'array',
              items: {
                type: 'string',
                pattern: '^[a-f0-9]{24}$',
                title: 'ID da categoria'
                }
              },
          min_quantity: {
            title: 'Quantidade mínima no carrinho',
            description: 'Mínimo de itens (total) no carrinho',
            type: 'integer',
            default: 1,
            minimum: 1,
            maximum: 9999999
            },
          same_product_quantity: {
            type: 'boolean',
            title: 'Checar quantidade de cada item',
            description: 'Aplicar desconto no produto apenas se a quantidade mínima for satisfeita no mesmo item do carrinho'
            },
          check_all_items: {
            type: 'boolean',
            default: true,
            title: 'Checar todos os produtos',
            description: 'Se deve haver pelo menos 1 unidade de cada produto no carrinho'
            },
          discount_lowest_price: {
            type: 'boolean',
            title: 'Descontar menor preço',
            description: 'Aplicar desconto com valor igual ao menor preço entre os produtos selecionados'
            },
          discount_kit_subtotal: {
            type: 'boolean',
            title: 'Descontar subtotal do kit',
            description: 'Aplicar desconto em função do subtotal somando apenas os produtos do kit'
            },
            cumulative_discount: {
              type: 'boolean',
              title: 'Desconto cumulativo',
              description: 'Se a promoção poderá ser aplicada junto a outros descontos.'
              },
          customer_ids: {
            title: 'Lista de clientes selecionados',
            description: 'Se preenchido, o desconto será disponibilizado apenas para estes clientes',
            type: 'array',
            items: {
              type: 'string',
              pattern: '^[a-f0-9]{24}$',
              title: 'ID do cliente'
              }
            },
          discount: {
            title: 'Desconto predefinido',
            type: 'object',
            required: [
              'value'
              ],
            additionalProperties: false,
            properties: {
              apply_at: {
                type: 'string',
                enum: [
                  'total',
                  'subtotal',
                  'freight'
                  ],
                default: 'total',
                title: 'Aplicar desconto em',
                description: 'Em qual valor o desconto deverá ser aplicado no checkout'
                },
              min_amount: {
                type: 'integer',
                minimum: 1,
                maximum: 999999999,
                title: 'Valor mínimo',
                description: 'Montante mínimo para aplicar o desconto'
                },
              type: {
                type: 'string',
                enum: [
                  'percentage',
                  'fixed'
                  ],
                default: 'fixed',
                title: 'Tipo de desconto',
                description: 'Desconto com valor percentual ou fixo'
                },
              value: {
                type: 'number',
                minimum: -99999999,
                maximum: 99999999,
                title: 'Valor do desconto',
                description: 'Valor percentual ou fixo a ser descontado, dependendo to tipo configurado'
                }
              }
            }
          }
        }
      },
    hide: false
    },
  freebies_rules: {
    schema: {
      title: 'Brindes',
      description: 'Adicionar produtos a preço zero com filtro por subtotal',
      type: 'array',
      items: {
        type: 'object',
        title: 'Regra para disponibilizar brindes',
        required: [
          'product_ids'
          ],
        additionalProperties: false,
        properties: {
          label: {
            type: 'string',
            maxLength: 100,
            title: 'Rótulo',
            description: 'Título (opcional) da promoção'
            },
          date_range: {
            type: 'object',
            title: 'Período de validade',
            description: 'Preencha para programar a oferta a datas de início e/ou fim',
            additionalProperties: false,
            properties: {
              start: {
                type: 'string',
                format: 'date-time',
                title: 'Início'
                },
              end: {
                type: 'string',
                format: 'date-time',
                title: 'Encerramento'
                }
              }
            },
          product_ids: {
            title: 'Produto(s) brinde',
            description: 'Lista de produtos fornecidos como prêmio',
            type: 'array',
            items: {
              type: 'string',
              pattern: '^[a-f0-9]{24}$',
              title: 'ID do produto'
              }
            },
          min_subtotal: {
            type: 'integer',
            minimum: 0,
            maximum: 999999999,
            title: 'Valor mínimo',
            description: 'Subtotal mínimo para disponibilizar o brinde'
            },
          customer_ids: {
            title: 'Lista de clientes selecionados',
            description: 'Se preenchido, os brindes serão disponibilizados apenas para estes clientes',
            type: 'array',
            items: {
              type: 'string',
              pattern: '^[a-f0-9]{24}$',
              title: 'ID do cliente'
              }
            },
          check_product_ids: {
            title: 'Lista de produtos da campanha',
            description: 'Se preenchido, o brinde só será aplicado se um dos produtos estiver no carrinho',
            type: 'array',
            items: {
              type: 'string',
              pattern: '^[a-f0-9]{24}$',
              title: 'ID do produto'
              }
            }
          }
        }
      },
    hide: false
    }
  }
}

/**
 * List of Procedures to be created on each store after app installation.
 * Ref.: https://developers.e-com.plus/docs/api/#/store/procedures/
 */

const procedures = []

/**
 * Uncomment and edit code above to configure `triggers` and receive respective `webhooks`:

const { baseUri } = require('./__env')

procedures.push({
  title: app.title,

  triggers: [
    // Receive notifications when new order is created:
    {
      resource: 'orders',
      action: 'create',
    },

    // Receive notifications when order financial/fulfillment status are set or changed:
    // Obs.: you probably SHOULD NOT enable the orders triggers below and the one above (create) together.
    {
      resource: 'orders',
      field: 'financial_status',
    },
    {
      resource: 'orders',
      field: 'fulfillment_status',
    },

    // Receive notifications when products/variations stock quantity changes:
    {
      resource: 'products',
      field: 'quantity',
    },
    {
      resource: 'products',
      subresource: 'variations',
      field: 'quantity'
    },

    // Receive notifications when cart is edited:
    {
      resource: 'carts',
      action: 'change',
    },

    // Receive notifications when customer is deleted:
    {
      resource: 'customers',
      action: 'delete',
    },

    // Feel free to create custom combinations with any Store API resource, subresource, action and field.
  ],

  webhooks: [
    {
      api: {
        external_api: {
          uri: `${baseUri}/ecom/webhook`
        }
      },
      method: 'POST'
    }
  ]
})

 * You may also edit `routes/ecom/webhook.js` to treat notifications properly.
 */

exports.app = app

exports.procedures = procedures
