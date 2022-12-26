import { Handlers, PageProps } from "$fresh/server.ts";
import { SessionIdentifier } from "$directus/auth.ts";
import { listStorageValues, StorageValue } from "$directus/storage.ts";

interface StorageData {
  items: Array<[SessionIdentifier, StorageValue]>;
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
    <div class="flex flex-col">
      <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div class="overflow-hidden">
            <table class="min-w-full text-center">
              <thead class="border-b bg-white">
                <tr>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-2"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-2"
                  >
                    session_id
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-2"
                  >
                    access_token
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-2"
                  >
                    refresh_token
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-2"
                  >
                    access_expires
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-2"
                  >
                    refresh_expires
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map(
                  ([uid, value], index) => (
                    <tr class="bg-white border-b">
                      <td class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                        {uid}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                        {value.access_token.substring(0, 20)}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                        {value.refresh_token.substring(0, 20)}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                        {new Date(value.accessTokenExpiresAt).toLocaleString()}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                        {new Date(value.refreshTokenExpiresAt).toLocaleString()}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
