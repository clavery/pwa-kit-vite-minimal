import { config } from "@/state/auth.ts"
import DefaultLayout from "./_layout.tsx"
import type { Route } from "./+types/product"
import sdk from 'commerce-sdk-isomorphic';
const {helpers, ShopperLogin, ShopperProducts} = sdk;

export function meta({ data }: Route.MetaArgs) {
    return [{ title: data.product.name }]
}

export async function loader({ params }: Route.LoaderArgs) {
    const { access_token } = await helpers.loginGuestUserPrivate(
        new ShopperLogin(config),
        {},
        {
            clientSecret: config.parameters.clientSecret,
        }
    )

    const shopperProducts = new ShopperProducts({
        ...config,
        headers: { authorization: `Bearer ${access_token}` },
    })

    const product = await shopperProducts.getProduct({
        parameters: { id: params.pid },
    })
    return { product }
}

export function headers() {
    return { "Cache-Control": "max-age=300", "x-foo": "bar" };
}

export default function Products({ loaderData }: Route.ComponentProps) {
    const product = loaderData.product
    return (
        <DefaultLayout>
            <div className="max-w-[800px] mx-auto my-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 justify-items-center">
                    <div>
                        <img
                            src={product?.imageGroups?.[0].images[0].link}
                            alt=""
                            className="max-w-[400px]"
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {product.name}
                            </h2>
                        </div>
                        <div>
                            <h3 className="text-1xl font-bold">
                                ${product.price}
                            </h3>
                        </div>
                        <div>
                            <p>{product.shortDescription}</p>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}
