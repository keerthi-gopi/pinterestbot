export async function postPin(product, pin, accessToken, boardId) {
  const body = {
    title: pin.title.slice(0, 100),
    description: pin.description,
    board_id: boardId,
    media_source: {
      source_type: "image_url",
      url: product.image || "",
    },
    link: product.link,
    alt_text: pin.title.slice(0, 500),
  };

  const res = await fetch("https://api.pinterest.com/v5/pins", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Pinterest ${res.status}: ${err.message ?? "unknown"}`);
  }
  return await res.json(); // { id, link }
}

export async function getBoards(accessToken) {
  const res = await fetch(
    "https://api.pinterest.com/v5/boards?page_size=25&privacy=PUBLIC",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error(`getBoards failed: ${res.status}`);
  const data = await res.json();
  return data.items ?? [];
}