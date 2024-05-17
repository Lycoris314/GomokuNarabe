import { GAME_STATE, STONE } from "./global";

export class GomokuNarabe {
    #field: number[][];
    #turn: number;
    #size: number;

    constructor(n: number) {
        this.#size = n;
        this.#turn = STONE.FIRST;
        this.#field = new Array(n + 2)
            .fill(null)
            .map((_) => new Array(n + 2).fill(STONE.NONE));
        for (let i = 0; i < n + 2; i++) {
            this.#field[i][0] = STONE.WALL;
            this.#field[i][n + 1] = STONE.WALL;
            this.#field[0][i] = STONE.WALL;
            this.#field[n + 1][i] = STONE.WALL;
        }
    }

    get field() {
        return this.#field.slice(1, -1).map((arr) => arr.slice(1, -1));
    }
    get turn() {
        return this.#turn;
    }
    get size() {
        return this.#size;
    }

    getOpponentTurn() {
        return this.turn === STONE.FIRST ? STONE.SECOND : STONE.FIRST;
    }

    putStone(row: number, col: number) {
        if (this.#field[row][col] !== STONE.NONE) {
            return null;
        } else {
            this.#field[row][col] = this.#turn;
            const state = this.checkGameState(
                row,
                col,
                this.#field,
                this.#turn
            );
            this.#turn = this.getOpponentTurn();
            return state;
        }
    }

    checkGameState(r: number, c: number, field: number[][], turn: number) {
        if (countStone([0, 1]) + countStone([0, -1]) >= 4) {
            return GAME_STATE.WIN;
        } else if (countStone([1, 0]) + countStone([-1, 0]) >= 4) {
            return GAME_STATE.WIN;
        } else if (countStone([1, 1]) + countStone([-1, -1]) >= 4) {
            return GAME_STATE.WIN;
        } else if (countStone([1, -1]) + countStone([-1, 1]) >= 4) {
            return GAME_STATE.WIN;
        } else if (
            field.every((arr) => {
                return arr.every((e) => e !== STONE.NONE);
            })
        ) {
            return GAME_STATE.DRAW;
        } else {
            return GAME_STATE.PENDING;
        }

        //dir方向に同種の石がいくつ連続してあるか数える
        function countStone(dir: [number, number]) {
            let row = r;
            let col = c;
            let count = 0;
            rec();
            function rec() {
                row += dir[0];
                col += dir[1];
                if (field[row][col] !== turn) {
                    return;
                }
                count++;
                rec();
            }
            return count;
        }
    }

    //COMの次の一手
    comNext() {
        //boxには空のマスのリストを入れる
        let box: [number, number][] = [];
        for (let i = 1; i <= this.#size; i++) {
            for (let j = 1; j <= this.#size; j++) {
                if (this.#field[i][j] == STONE.NONE) {
                    box.push([i, j]);
                }
            }
        }

        for (let elm of box) {
            let [i, j] = elm;
            let field = structuredClone(this.#field);
            field[i][j] = this.turn;
            if (
                this.checkGameState(i, j, field, this.turn) === GAME_STATE.WIN
            ) {
                return [i - 1, j - 1];
            }
        }

        for (let elm of box) {
            let [i, j] = elm;
            let field = structuredClone(this.#field);
            field[i][j] = this.getOpponentTurn();
            if (
                this.checkGameState(i, j, field, this.getOpponentTurn()) ===
                GAME_STATE.WIN
            ) {
                return [i - 1, j - 1];
            }
        }

        for (let elm of box) {
            let [i, j] = elm;
            let field = structuredClone(this.#field);
            field[i][j] = this.turn;
            const gsa = this.getStoneArray(i, j, field, this.turn);
            let idx = gsa.counts.findIndex((e) => e === 3);
            if (idx >= 0 && gsa.noneEnds[idx] === 2) {
                return [i - 1, j - 1];
            }
        }

        for (let elm of box) {
            let [i, j] = elm;
            let field = structuredClone(this.#field);
            field[i][j] = this.turn;
            const gsa = this.getStoneArray(i, j, field, this.turn);
            let idx = gsa.counts.findIndex((e) => e === 3);
            let idx2 = gsa.counts.findIndex((e) => e === 2);
            if (
                idx >= 0 &&
                gsa.noneEnds[idx] == 1 &&
                idx2 >= 0 &&
                gsa.noneEnds[idx2] == 2
            ) {
                return [i - 1, j - 1];
            }
        }

        for (let elm of box) {
            let [i, j] = elm;
            let field = structuredClone(this.#field);
            field[i][j] = this.turn;
            const gsa = this.getStoneArray(i, j, field, this.turn);
            let idx = gsa.counts.findIndex((e) => e === 3);
            if (idx >= 0 && gsa.noneEnds[idx] === 1) {
                if (Math.random() < 0.5) {
                    continue;
                }
                return [i - 1, j - 1];
            }
        }

        //相手の4連を封じる
        for (let elm of box) {
            let [i, j] = elm;
            let field = structuredClone(this.#field);
            field[i][j] = this.getOpponentTurn();
            const gsa = this.getStoneArray(i, j, field, this.getOpponentTurn());
            let idx = gsa.counts.findIndex((e) => e === 3);
            if (idx >= 0 && gsa.noneEnds[idx] === 2) {
                return [i - 1, j - 1];
            }
        }
        //相手の4-3を封じる
        for (let elm of box) {
            let [i, j] = elm;
            let field = structuredClone(this.#field);
            field[i][j] = this.getOpponentTurn();
            const gsa = this.getStoneArray(i, j, field, this.getOpponentTurn());
            let idx = gsa.counts.findIndex((e) => e == 3);
            let idx2 = gsa.counts.findIndex((e) => e == 2);
            if (
                idx >= 0 &&
                gsa.noneEnds[idx] == 1 &&
                idx2 >= 0 &&
                gsa.noneEnds[idx2] == 2
            ) {
                return [i - 1, j - 1];
            }
        }

        for (let elm of box) {
            let [i, j] = elm;
            let field = structuredClone(this.#field);
            field[i][j] = this.turn;
            const gsa = this.getStoneArray(i, j, field, this.turn);

            let idx = gsa.counts.findIndex((e) => e == 2);
            if (idx >= 0 && gsa.noneEnds[idx] == 2) {
                return [i - 1, j - 1];
            }
        }

        for (let elm of box) {
            let [i, j] = elm;
            let field = structuredClone(this.#field);
            field[i][j] = this.getOpponentTurn();
            const gsa = this.getStoneArray(i, j, field, this.getOpponentTurn());

            let idx = gsa.counts.findIndex((e) => e == 2);
            if (idx >= 0 && gsa.noneEnds[idx] == 2) {
                return [i - 1, j - 1];
            }
        }

        for (let elm of box) {
            let [i, j] = elm;
            let field = structuredClone(this.#field);
            field[i][j] = this.turn;
            const gsa = this.getStoneArray(i, j, field, this.turn);
            let idx2 = gsa.counts.findIndex((e) => e == 1);
            let idx3 = gsa.counts.findIndex((e, i) => e == 1 && i > idx2);
            if (
                idx2 >= 0 &&
                gsa.noneEnds[idx2] == 2 &&
                idx3 >= 0 &&
                gsa.noneEnds[idx3] == 2
            ) {
                return [i - 1, j - 1];
            }
        }

        //上記すべてに当てはまらない場合に空いているマスにテキトウに打つ
        let midIndex = Math.floor(box.length / 2);
        let [i, j] = box[midIndex];
        return [i - 1, j - 1];
    }

    //横方向、縦方向、斜め方向×2　の４方向について同種の石が連続している数およびその両端が空マスである数を計算してリストにして返す。
    getStoneArray(r: number, c: number, field: number[][], turn: number) {
        let countBox: number[] = [];
        let noneEndBox: number[] = [];

        countBox.push(countStone([0, 1]).count + countStone([0, -1]).count);
        noneEndBox.push(
            countStone([0, 1]).noneEnd + countStone([0, -1]).noneEnd
        );
        countBox.push(countStone([1, 0]).count + countStone([-1, 0]).count);
        noneEndBox.push(
            countStone([1, 0]).noneEnd + countStone([-1, 0]).noneEnd
        );
        countBox.push(countStone([1, 1]).count + countStone([-1, -1]).count);
        noneEndBox.push(
            countStone([1, 1]).noneEnd + countStone([-1, -1]).noneEnd
        );
        countBox.push(countStone([1, -1]).count + countStone([-1, 1]).count);
        noneEndBox.push(
            countStone([1, -1]).noneEnd + countStone([-1, 1]).noneEnd
        );

        return { counts: countBox, noneEnds: noneEndBox };

        //dir方向に同種の石が連続して何個あるか(count)、さらにその直後が空マスかどうか(空マスのときnoneEndは1)を返す。
        function countStone(dir: [number, number]) {
            let row = r;
            let col = c;
            let count = 0;
            let noneEnd = 0;
            rec();
            function rec() {
                row += dir[0];
                col += dir[1];
                if (field[row][col] !== turn) {
                    noneEnd = field[row][col] == STONE.NONE ? 1 : 0;
                    return;
                }
                count++;
                rec();
            }
            return { count: count, noneEnd: noneEnd };
        }
    }
}
