export const getBaseUrl = () => {
  // 1) 明示指定が最優先
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // 2) Vercel 環境（Preview/Prod）なら VERCEL_URL から作る
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // 3) 最後の手段（ローカル開発）
  return 'http://localhost:3000';
};
