import { Handlers, PageProps } from "$fresh/server.ts";
import { SessionIdentifier } from "@/utils/directus/auth.ts";
import { listStorageValues, StorageValue } from "@/utils/directus/storage.ts";
import { AfxAppFrame } from "@/components/AfxAppFrame.tsx";
import AfxHeader from "@/islands/AfxHeader.tsx";

type StorageItem = [SessionIdentifier, StorageValue];

interface StorageData {
  items: StorageItem[];
}

export const handler: Handlers<StorageData> = {
  async GET(req, ctx) {
    const items = listStorageValues();
    const resp = await ctx.render({ items });
    return resp;
  },
};

export default function StoragePage({ data }: PageProps<StorageData>) {
  return (
    <AfxAppFrame>
      <AfxHeader name="Storage" placeholder />
      <div class="bg-gray-100 min-h-screen pb-2 -z-10">
        {data.items.map((item, index) => <Item item={item} index={index} />)}
      </div>
    </AfxAppFrame>
  );
}

function Item(props: { item: StorageItem; index: number }) {
  const { item, index } = props;
  const [session_id, v] = item;
  return (
    <div class="card mx-2 mt-2 bg-base-100 shadow rounded">
      <div class="card-body">
        <Field name="编号" value={String(index)} />
        <Field name="会话ID" value={session_id} />
        <Field
          name="访问令牌"
          value={`...${v.access_token.substring(v.access_token.length - 20)}`}
        />
        <Field
          name="刷新令牌"
          value={`${v.refresh_token.substring(0, 20)}...`}
        />
        <Field
          name="访问过期"
          value={new Date(v.accessTokenExpiresAt).toLocaleString()}
        />
        <Field
          name="刷新过期"
          value={new Date(v.refreshTokenExpiresAt).toLocaleString()}
        />
        <Field name="用户ID" value={v.user_id} />
      </div>
    </div>
  );
}

function Field(props: { name: string; value: string }) {
  return (
    <div class="flex">
      <div class="w-[30%] text-xs text-gray-400 pr-4">{props.name}</div>
      <div class="w-[70%] text-xs">{props.value}</div>
    </div>
  );
}
