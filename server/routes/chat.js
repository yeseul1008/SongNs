const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require("../db");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const authMiddleware = require("../auth");


// 채팅방 유무 확인하기
router.post("/chatRoomCheck", async (req, res) => {

    let { userId, followUserId } = req.body;
    try {
        let sql = "SELECT * FROM SNS_CHAT_ROOM_TBL WHERE (USER1_ID = ? AND USER2_ID = ?) OR (USER1_ID = ? AND USER2_ID = ?)";
        let [list] = await db.query(sql, [userId, followUserId, followUserId, userId]);
        if (list.length > 0) {
            // 채팅방 이미 존재하는 경우
            res.json({
                exists: true,
                chatRoomId: list[0].ROOM_ID
            });
        } else {
            // 채팅방 존재 안하는 경우
            res.json({
                exists: false
            });
        }

    } catch (error) {
        console.log(error);
    }
})

// 채팅방 생성하기
router.post("/creatChatRoom", async (req, res) => {
    let { senderId, receiverId } = req.body;
    try {
        let sql = "INSERT INTO SNS_CHAT_ROOM_TBL (USER1_ID, USER2_ID) VALUES (?, ?)";
        let [result] = await db.query(sql, [senderId, receiverId]);
        // result.insertId 가 MySQL일 경우 생성된 ID
        res.json({
            chatRoomId: result.insertId,
            msg: "success"
        });
    } catch (error) {
        console.log(error);
    }
})
// 채팅내역 불러오기
router.get("/getMessages/:chatRoomId", async (req, res) => {
    let { chatRoomId } = req.params;
    try {
        let sql = "SELECT MESSAGE_ID, ROOM_ID, SENDER_ID, MESSAGE, IS_READ, CREATED_AT FROM SNS_CHAT_MESSAGE_TBL WHERE ROOM_ID = ? ORDER BY CREATED_AT ASC";
        let [list] = await db.query(sql, [chatRoomId]);
        res.json({
            list,
            result: "success"
        })

    } catch (error) {
        console.log(error);
    }
})
// 채팅 보내기

// POST /chat/sendChat
router.post('/sendChat', async (req, res) => {
    const { chatRoomId, senderId, message } = req.body;
    try {
        if (!chatRoomId || !senderId || !message) {
            return res.status(400).json({ success: false, msg: "필수 데이터 누락" });
        }
        const sql = `
      INSERT INTO SNS_CHAT_MESSAGE_TBL (ROOM_ID, SENDER_ID, MESSAGE, IS_READ, CREATED_AT)
      VALUES (?, ?, ?, 'N', NOW())
    `;
        const [result] = await db.execute(sql, [chatRoomId, senderId, message]);

        res.json({
            success: true,
            msg: "메시지 전송 성공",
            messageId: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "서버 에러!!" });
    }
});

// 나에게온 채팅들 불러오기(알림창)
router.get("/FriendList/:userId", async (req, res) => {
    let { userId } = req.params;
    try {
        let sql = "SELECT " +
    "    r.ROOM_ID, " +
    "    u.USER_ID AS OTHER_USER_ID, " +
    "    u.NICKNAME AS OTHER_NICKNAME, " +
    "    u.PROFILE_IMG AS OTHER_PROFILE_IMG, " +
    "    m.MESSAGE AS LAST_MESSAGE, " +
    "    m.CREATED_AT AS LAST_MESSAGE_TIME, " +
    "    m.IS_READ AS LAST_MESSAGE_READ, " +
    "    m.SENDER_ID AS LAST_MESSAGE_SENDER_ID " +  // 추가된 부분
    "FROM SNS_CHAT_ROOM_TBL r " +
    "JOIN SNS_USER_TBL u " +
    "    ON u.USER_ID = ( " +
    "        CASE " +
    "            WHEN r.USER1_ID = ? THEN r.USER2_ID " +
    "            ELSE r.USER1_ID " +
    "        END " +
    "    ) " +
    "JOIN ( " +
    "    SELECT " +
    "        ROOM_ID, " +
    "        MESSAGE, " +
    "        CREATED_AT, " +
    "        IS_READ, " +
    "        SENDER_ID " +   // 마지막 메시지 보낸 사람 컬럼 추가
    "    FROM SNS_CHAT_MESSAGE_TBL " +
    "    WHERE (ROOM_ID, CREATED_AT) IN ( " +
    "        SELECT ROOM_ID, MAX(CREATED_AT) " +
    "        FROM SNS_CHAT_MESSAGE_TBL " +
    "        GROUP BY ROOM_ID " +
    "    ) " +
    ") m ON m.ROOM_ID = r.ROOM_ID " +
    "WHERE r.USER1_ID = ? OR r.USER2_ID = ? " +
    "ORDER BY m.CREATED_AT DESC";
        let [list] = await db.query(sql, [userId, userId, userId]);
        // console.log("친구채팅==>", list);
        res.json({
            list,
            result: "채팅리스트 success"
        })

    } catch (error) {
        console.log(error);
    }
})
// 마지막 채팅 읽음처리
router.post("/markAsRead", async (req, res) => {
    const { roomId } = req.body;

    if (!roomId) {
        return res.status(400).json({ message: "roomId가 필요합니다." });
    }

    try {
        // MySQL 예시
        const sql = `
  UPDATE SNS_CHAT_MESSAGE_TBL AS m
  JOIN (
    SELECT ROOM_ID, MAX(CREATED_AT) AS last_time
    FROM SNS_CHAT_MESSAGE_TBL
    WHERE ROOM_ID = ?
    GROUP BY ROOM_ID
  ) AS t ON m.ROOM_ID = t.ROOM_ID AND m.CREATED_AT = t.last_time
  SET m.IS_READ = 'Y'
`;
        await db.query(sql, [roomId]);


        return res.json({ success: true, message: "마지막 메시지 읽음 처리 완료" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "서버 오류" });
    }
});
module.exports = router;