const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3030 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }

      if (client === ws && client.readyState === WebSocket.OPEN) {
        // 處理 成功傳送到 server
        // Notice: 補 uuid

        let backToSelfData = JSON.parse(data);

        backToSelfData[`isSendSuccess`] = true;

        const objStr = JSON.stringify({
          isSendSuccess: true,
          uuid: backToSelfData[`uuid`],
        });
        client.send(objStr);
      }

      // TODO: 存到資料庫留底
      // TODO: 處理資料庫中，多人已讀訊息
    });
  });
});
