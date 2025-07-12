export async function getTTS(text) {
  if (!text.trim()) return;

  try {
    const response = await fetch("http://translate.ruskcode.top/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    return url;
  } catch (err) {
    console.error("TTS Error:", err);
    alert("语音获取失败");
  }
}
