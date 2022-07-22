{
  /* <div className={style.Table}>
              {loading ? (
                <div className={style.Loader}>
                  <Loading />
                </div>
              ) : (
                <>
                  {products.length > 0 ? (
                    products
                      .filter((value) => value.amountStock >= 1)
                      .map((product) => {
                        console.log(
                          'PRODUCT..',
                          product,
                          getValues('products[0]')
                        );
                        return (
                          <div className={style.TableItem} key={product._id}>
                            <div className={style.CheckBox}>
                              <Input
                                name="products"
                                text=""
                                register={register}
                                value={product._id}
                                errors={
                                  errors.products && errors.products.message
                                }
                                type="checkbox"
                              />
                            </div>
                            <p>{product.code}</p>
                            <p>{product.category.label}</p>
                            <p>{product.description}</p>
                            <p>{`R$${product.costSale}`}</p>
                            <p>{`${product.amountStock} Em estoque`}</p>
                            <input
                              type="number"
                              min="1"
                              max={product.amountStock}
                              name="amount"
                              placeholder="Qtd."
                              onBlur={(e) => {
                                if (e.target.value > product.amountStock) {
                                  toast.error(
                                    `Essa qtd. de ${product.description} não pode ser cadastrada pois é maior a no estoque!`
                                  );
                                } else {
                                  setProductsAmount([
                                    ...productsAmount.filter(
                                      (data) => data.product !== product._id
                                    ),
                                    {
                                      product: product._id,
                                      amount: e.target.value,
                                      value: product.costSale,
                                    },
                                  ]);
                                }
                              }}
                            />
                          </div>
                        );
                      })
                  ) : (
                    <div className={style.EmptyImage}>
                      <img
                        style={{ width: '30vw' }}
                        src={emptyImage}
                        alt="Footer Action"
                      />
                      <p>Não há produtos cadastrados</p>
                    </div>
                  )}
                </>
              )}
            </div> */
}
