import { parseStringPromise } from "xml2js";

export default async function getKdList(req, res) {
  const KD_URI = process.env.NEXT_PUBLIC_IP_KD_URI;

  if (req.method === "GET") {
    try {
      const response = await fetch(`${KD_URI}&arcode=26140`);

      // 응답의 Content-Type 헤더를 확인합니다. XML 형식이어야 합니다.
      const contentType = response.headers.get("content-type");

      // 응답 본문을 텍스트 형태로 읽어옴
      const text = await response.text();

      // 응답의 Content-Type이 application/xml이 아니면 500 상태 코드 반환.
      if (!contentType || !contentType.includes("application/xml")) {
        return res.status(500).json({ error: "Invalid response format" });
      }

      // XML 텍스트를 JavaScript 객체로 변환
      const data = await parseStringPromise(text);
      // 변환된 데이터를 JSON 형식으로 클라이언트에 응답으로 보넴
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    // 만약 GET 메소드가 아닌 다른 메소드로 요청이 들어오면 405 상태 코드와 함께 오류 메시지 반환
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
