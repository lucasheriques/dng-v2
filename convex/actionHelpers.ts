import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { ActionCtx } from "./_generated/server";

export const checkIfProductCanBePurchased = async (
  ctx: ActionCtx,
  productId: Id<"products">,
  userId: Id<"users">
) => {
  const product = await ctx.runQuery(internal.products.get, {
    id: productId,
  });
  if (!product) {
    throw new Error("Product not found");
  }

  const user = await ctx.runQuery(api.users.get, {
    id: userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!product.isActive) {
    throw new Error("This product is not available for purchase");
  }

  const existingPurchase = await ctx.runQuery(
    internal.purchases.checkUserPurchase,
    {
      productId,
      userId,
    }
  );

  if (existingPurchase) {
    throw new Error("You already have this product");
  }

  return { product, user };
};
