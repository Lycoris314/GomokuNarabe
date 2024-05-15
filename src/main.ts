//npm i --save-dev @types/jquery でjqueryの型導入
import $ from "jquery";
import { GomokuNarabe } from "./gomoku";
import { GAME_STATE, STONE } from "./global";

$(() => {
    //碁盤の表示
    makeTable(19);
    function makeTable(N: number) {
        let tbody = $("<tbody>");
        for (let i = 0; i < N; i++) {
            let tr = $("<tr>");
            for (let j = 0; j < N; j++) {
                let td = $("<td>")
                    .addClass("cross")
                    .attr("data-y", i)
                    .attr("data-x", j);
                tr.append(td);
            }
            tbody.append(tr);
        }
        $("table.cross").append(tbody);

        let tbody2 = $("<tbody>");
        for (let i = 0; i < N - 1; i++) {
            let tr = $("<tr>");
            for (let j = 0; j < N - 1; j++) {
                let td = $("<td>").addClass("masu");
                tr.append(td);
            }
            tbody2.append(tr);
        }
        $("table.masu").append(tbody2);
    }

    let gomoku = new GomokuNarabe(19);
    let inGame = true; //ゲームが終了したらfalse
    let comBattle = false; //COM対戦モードでtrue
    let comThinking = false; //COMのターン中true

    //碁盤の目をクリック
    $("td.cross").on("click", tdClickEvent);

    function tdClickEvent() {
        if (!inGame || comThinking) {
            return;
        }
        const y = Number($(this).attr("data-y"));
        const x = Number($(this).attr("data-x"));

        const state = gomoku.putStone(y + 1, x + 1);
        if (state !== null) {
            $("td.cross").removeClass("shadow");
            if (gomoku.turn == STONE.FIRST) {
                $(this).addClass("white shadow");
            } else {
                $(this).addClass("black shadow");
            }
            //テキスト更新
            writeText(state);
            function writeText(state: number | null) {
                let text = "";
                switch (state) {
                    case GAME_STATE.PENDING: {
                        text =
                            gomoku.turn === STONE.FIRST
                                ? "黒の番です。"
                                : "白の番です。";
                        break;
                    }
                    case GAME_STATE.WIN: {
                        text =
                            gomoku.turn === STONE.FIRST
                                ? "白の勝ちです。"
                                : "黒の勝ちです。";
                        inGame = false;
                        comBattle = false;
                        break;
                    }
                    case GAME_STATE.DRAW: {
                        text = "引き分けです。";
                        inGame = false;
                        comBattle = false;
                        break;
                    }
                }
                $("p.turn").text(text);
            }

            //COM対戦におけるCOMの手
            if (comBattle) {
                comThinking = true;
                setTimeout(() => {
                    comThinking = true;
                    let [y, x] = gomoku.comNext();
                    const st = gomoku.putStone(y + 1, x + 1);
                    const td = $(`td.cross[data-y='${y}'][data-x='${x}']`);
                    $("td.cross").removeClass("shadow");
                    if (gomoku.turn == STONE.FIRST) {
                        td.addClass("white shadow");
                    } else {
                        td.addClass("black shadow");
                    }
                    writeText(st);
                    comThinking = false;
                }, 500);
            }
        }
    }
    //リセットボタンクリック
    $("button.reset").on("click", () => {
        reset(gomoku.size);
        comBattle = false;
    });
    //設定ボタンクリック
    $("button.config").on("click", () => {
        $("div.config").addClass("show");
    });

    //あなたが先手クリック
    $("button.first").on("click", () => {
        reset(gomoku.size);
        comBattle = true;
        $("div.config").removeClass("show");
    });
    //あなたが後手クリック
    $("button.second").on("click", () => {
        reset(gomoku.size);
        comBattle = true;
        $("div.config").removeClass("show");
        const center = (gomoku.size - 1) / 2;
        gomoku.putStone(center + 1, center + 1);
        $(`td.cross[data-y=${center}][data-x=${center}]`).addClass("black");
        $("p.turn").text("白の番です。");
    });

    //サイズを19×19に変更
    $("#size19").on("change", () => {
        $("table.cross").empty();
        $("table.masu").empty();
        makeTable(19);
        $("td.cross").on("click", tdClickEvent);
        $("table.masu").removeClass("size11 size15");
        reset(19);
    });
    //サイズを15×15に変更
    $("#size15").on("change", () => {
        $("table.cross").empty();
        $("table.masu").empty();
        makeTable(15);
        $("td.cross").on("click", tdClickEvent);
        $("table.masu").addClass("size15");
        $("table.masu").removeClass("size11");
        reset(15);
    });
    //サイズを11×11に変更
    $("#size11").on("change", () => {
        $("table.cross").empty();
        $("table.masu").empty();
        makeTable(11);
        $("td.cross").on("click", tdClickEvent);
        $("table.masu").removeClass("size15");
        $("table.masu").addClass("size11");
        reset(11);
    });

    //戻るボタンをクリック
    $("button.back").on("click", () => {
        $("div.config").removeClass("show");
    });

    function reset(n: number) {
        gomoku = new GomokuNarabe(n);
        $("td.cross").removeClass("black white");
        $("p.turn").text("黒の番です。");
        inGame = true;
    }
});
