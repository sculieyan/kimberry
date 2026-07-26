import { Client } from 'pg';

export const dynamic = 'force-dynamic';

type TestRow = Record<string, unknown>;

function getDatabaseUrl(): string | undefined {
  if (!process.env.DATABASE_URL) {
    return undefined;
  }

  const databaseUrl = new URL(process.env.DATABASE_URL);
  databaseUrl.searchParams.set('uselibpqcompat', 'true');
  return databaseUrl.toString();
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

async function getTestRows(): Promise<TestRow[]> {
  const databaseUrl = getDatabaseUrl();
  const client = new Client(
    databaseUrl
      ? {
          connectionString: databaseUrl,
        }
      : {
          host: process.env.DB_HOST ?? '127.0.0.1',
          port: Number(process.env.DB_PORT ?? 5433),
          database: process.env.DB_NAME ?? 'postgres',
          user: process.env.DB_USER ?? 'postgres',
          password: process.env.DB_PASSWORD,
          ssl: { rejectUnauthorized: false },
        },
  );

  try {
    await client.connect();
    const result = await client.query<TestRow>('SELECT * FROM test');
    return result.rows;
  } finally {
    await client.end();
  }
}

export default async function AdminPage() {
  const rows = await getTestRows();
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <main className="min-h-screen bg-white p-8 text-black">
      <h1 className="mb-6 text-2xl font-semibold">Test 表数据</h1>

      {rows.length === 0 ? (
        <p>暂无数据</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    className="border border-gray-300 bg-gray-100 px-4 py-2 text-left"
                    key={column}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td
                      className="border border-gray-300 px-4 py-2"
                      key={column}
                    >
                      {formatCell(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
