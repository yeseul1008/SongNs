const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require("../db");
const jwt = require('jsonwebtoken');

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
    console.log(req.body);
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

router.get("/:userId", async (req, res) => {
    let { userId } = req.params;
    try {
        // 1. 두개 쿼리 써서 리턴
        //    let [list] = await db.query("SELECT * FROM TBL_USER WHERE USERID = ?", [userId]);
        //    let [cnt] = await db.query("SELECT COUNT(*) FROM TBL_FEED WHERE USERID = ?", [userId]);
        //    res.json({
        //     user : list[0],
        //     cnt : cnt[0]
        //    }) 

        // 2. 조인쿼리 만들어서 하나로 리턴
        let sql =
            "SELECT U.*, IFNULL(T.CNT, 0) cnt " + // 띄어쓰기 꼭 필요
            "FROM TBL_USER U " +
            "LEFT JOIN ( " +
            "    SELECT USERID, COUNT(*) CNT " +
            "    FROM TBL_FEED " +
            "    GROUP BY USERID " +
            ") T ON U.USERID = T.USERID " +
            "WHERE U.USERID = ?";
        let [list] = await db.query(sql, [userId]);
        res.json({
            user: list[0],
            result: "success"
        })



    } catch (error) {
        console.log(error);
    }
})

module.exports = router;