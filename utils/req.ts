interface indexNowReqBody {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export const indexNow = async (json: indexNowReqBody) => {
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(json),
  });
  return {
    ok: res.ok,
    status: res.status,
  };
};
