import type { Schema, Struct } from "@strapi/strapi";

export interface GroupitemGroupitem extends Struct.ComponentSchema {
  collectionName: "components_group_item_group_items";
  info: {
    description: "";
    displayName: "groupItem";
  };
  attributes: {
    gPlace: Schema.Attribute.Text;
    gTitle: Schema.Attribute.String;
    Year: Schema.Attribute.BigInteger & Schema.Attribute.DefaultTo<"2004">;
  };
}

declare module "@strapi/strapi" {
  export module Public {
    export interface ComponentSchemas {
      "groupitem.groupitem": GroupitemGroupitem;
    }
  }
}
