const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require("../db");
const jwt = require('jsonwebtoken');
const authMiddleware = require("../auth");
// 해시 함수 실행 위해 사용할 키로 아주 긴 랜덤한 문자를 사용하길 권장하며, 노출되면 안됨.
const JWT_KEY = "server_secret_key";

router.post("/checkId", async (req, res) => {

    // console.log(`${req.protocol}://${req.get("host")}`);
    let { userId } = req.body;
    try {
        let sql = "SELECT * FROM SNS_USER_TBL WHERE USER_ID = ?";
        let [list] = await db.query(sql, [userId]);
        if (list.length > 0) {
            // 이미 존재하는 경우
            res.json({
                result: false,
                msg: "이미 등록된 아이디입니다."
            });
        } else {
            // 사용 가능한 경우
            res.json({
                result: true,
                msg: "사용 가능한 아이디입니다."
            });
        }

    } catch (error) {
        console.log(error);
    }
})

router.post("/join", async (req, res) => {
    let { userId, pwd, nickName, mail } = req.body;
    try {
        let hashPwd = await bcrypt.hash(pwd, 10);
        let sql = "INSERT INTO SNS_USER_TBL(USER_ID, PASSWORD, NICKNAME, EMAIL, CREATED_AT, UPDATED_AT) VALUES (?, ?, ?, ?, NOW(), NOW())";
        let result = await db.query(sql, [userId, hashPwd, nickName, mail]);

        res.json({
            result: result,
            msg: "가입되었습니다!"
        });
    } catch (error) {
        console.log(error);
    }
})

router.post("/login", async (req, res) => {
    let { userId, pwd } = req.body;
    
    try {

        let sql = "SELECT * FROM SNS_USER_TBL WHERE USER_ID = ?";
        let [list] = await db.query(sql, [userId]);
        let msg = "";
        let result = false;
        let token = null; // 토큰 변수 외부에 선언
        if (list.length > 0) {
            let match = await bcrypt.compare(pwd, list[0].PASSWORD);
            if (match) {
                msg = list[0].NICKNAME + "님 환영합니다!"
                result = true;

                let user = { // 토큰으로 보낼 정보들
                    userId: list[0].USER_ID,
                    nickName: list[0].NICKNAME,
                    status: list[0].STATUS // 권한 일단 하드코딩(db에 없어서..)
                    // 권한 등 필요한 정보 추가
                };

                token = jwt.sign(user, JWT_KEY, { expiresIn: '1h' });
                console.log(user);
            } else {
                msg = "패스워드를 확인해주세요."
            }
        } else {
            msg = "아이디가 존재하지 않습니다."
        }
        res.json({
            result: result,
            msg: msg,
            token: token // 토큰 전달
        });
    } catch (error) {
        console.log(error);
    }
})

router.post("/findId", async (req, res) => {

    // console.log(`${req.protocol}://${req.get("host")}`);
    let { nickName, mail } = req.body;
    try {
        let sql = "SELECT * FROM SNS_USER_TBL WHERE NICKNAME = ? AND EMAIL = ?";
        let [list] = await db.query(sql, [nickName, mail]);
        if (list.length > 0) {
            // 이미 존재하는 경우
            res.json({
                result: true,
                id: list[0].USER_ID,
                nickname: list[0].NICKNAME,
                msg: "회원님의 아이디는" + list[0].USER_ID
            });
        } else {
            // 사용 가능한 경우
            res.json({
                result: false,
                msg: "등록되지 않은 메일입니다."
            });
        }

    } catch (error) {
        console.log(error);
    }
})

router.post("/findPwd", async (req, res) => {

    // console.log(`${req.protocol}://${req.get("host")}`);
    let { userId, nickName, mail } = req.body;
    try {
        let sql = "SELECT * FROM SNS_USER_TBL WHERE USER_ID = ? AND NICKNAME = ? AND EMAIL = ?";
        let [list] = await db.query(sql, [userId, nickName, mail]);
        if (list.length > 0) {
            // 비밀번호 찾음
            res.json({
                result: true,
            });
        } else {
            // 못찾은 경우
            res.json({
                result: false,
            });
        }

    } catch (error) {
        console.log(error);
    }
})
router.post("/updatePwd", async (req, res) => {
    let { userId, newPwd } = req.body;
    // console.log(req.body);
    try {
        let hashPwd = await bcrypt.hash(newPwd, 10);
        let sql = "UPDATE SNS_USER_TBL SET PASSWORD = ? WHERE USER_ID = ?";
        let result = await db.query(sql, [hashPwd, userId]);

        res.json({
            result: result,
            msg: "비밀번호가 변경 되었습니다."
        });
    } catch (error) {
        console.log(error);
    }
})

// 나에게 달린 댓글 목록 불러오기(알림창 전용)
router.get("/commentList/:userId", async (req, res) => {
  let { userId } = req.params;
  try {
    let sql = "SELECT c.COMMENT_ID, c.POST_ID, c.USER_ID, u.PROFILE_IMG, u.NICKNAME, c.COMMENT, c.CREATED_AT, c.IS_READ FROM SNS_COMMENT_TBL c JOIN SNS_USER_TBL u ON c.USER_ID = u.USER_ID WHERE c.POST_ID IN (SELECT POST_ID FROM SNS_POST_TBL WHERE USER_ID = ?) ORDER BY c.CREATED_AT DESC";
    let [list] = await db.query(sql, [userId]);
    res.json({
      list,
      result: "댓글리스트 success"
    })

  } catch (error) {
    console.log(error);
  }
})
// 댓글 읽음 표시로 바꾸기
router.post("/commentRead", async (req, res) => {
    let { commentId } = req.body;
    try {
        let sql = "update sns_comment_tbl set is_read = 'Y' where comment_id = ?";
        let result = await db.query(sql, [commentId]);

        res.json({
            result: result,
            msg: "읽음 처리 완료"
        });
    } catch (error) {
        console.log(error);
    }
})

// 댓글 삭제
router.delete("/commentDelete/:commentId", authMiddleware, async (req, res) => {
    let { commentId } = req.params;
    try {
        let sql = "DELETE FROM SNS_COMMENT_TBL WHERE COMMENT_ID = ?";
        let result = await db.query(sql, [commentId]);
        res.json({
            result: result,
            msg: "삭제 완료"

        });
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;