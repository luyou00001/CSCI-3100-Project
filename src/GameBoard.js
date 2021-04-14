import React, {
    Component
} from 'react';
import pressed from "pressed"

import red_floor from "./picture/red_floor.jpg";
import blue_floor from "./picture/blue_floor.jpg";
import black_floor from "./picture/black_floor.jpg";
import fire from "./picture/fire.gif";
import red_entrance_img from "./picture/red_entrance.gif";
import blue_entrance_img from "./picture/blue_entrance.gif";
import vanish_img from "./picture/vanish.gif"
import man_1_back from "./picture/man/man_1_back.gif";
import man_1_front from "./picture/man/man_1_front.gif";
import man_1_left from "./picture/man/man_1_left.gif";
import man_1_right from "./picture/man/man_1_right.gif";
import man_2_back from "./picture/man/man_2_back.gif";
import man_2_front from "./picture/man/man_2_front.gif";
import man_2_left from "./picture/man/man_2_left.gif";
import man_2_right from "./picture/man/man_2_right.gif";
import man_3_back from "./picture/man/man_3_back.gif";
import man_3_front from "./picture/man/man_3_front.gif";
import man_3_left from "./picture/man/man_3_left.gif";
import man_3_right from "./picture/man/man_3_right.gif";
import man_4_back from "./picture/man/man_4_back.gif";
import man_4_front from "./picture/man/man_4_front.gif";
import man_4_left from "./picture/man/man_4_left.gif";
import man_4_right from "./picture/man/man_4_right.gif";
import empty_img from "./picture/empty.gif";
pressed.start()

class GameBoard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            board: [],
            vanish: [],
            entityStates: {
                /*empty: '　',
                player: '♂',
                entrance: '╬'*/
                empty: 0,
                entrance: 1,
                player: 2
                /*player: 2 ~ 5*/
            }
        }
        this.setPlayer = this.setPlayer.bind(this)
    }
    
    componentWillMount() {
        this.initializeGameBoard()
    }

    initializeGameBoard() {
        let {
            boardHeight,
            boardWidth,
            areaHeight,
            areaWidth,
            playerPosition
        } = this.props
        let {
            entityStates
        } = this.state
        let board = []
        let vanish = []
        for (let i = 0; i < boardWidth + boardHeight - 1; i++) vanish.push(false)
        vanish[boardWidth + boardHeight - 2] = true
        
        for (let j = 0; j < boardHeight; j++) {
            let tempArray_1 = []
            for (let i = 0; i < boardWidth; i++) {
                let tempArray_2 = []
                for (let y = 0; y < areaHeight; y++) {
                    let tempArray_3 = []
                    for (let x = 0; x < areaWidth; x++) {                        
                        if ((x === 0 && y === 0) || (x === areaWidth - 1 && y === 0) || (x === areaWidth - 1 && y === areaHeight - 1) || (x === 0 && y === areaHeight - 1)) {
                            tempArray_3.push(entityStates.entrance)
                        } else {
                            tempArray_3.push(entityStates.empty)
                        }
                    }
                    tempArray_2.push(tempArray_3)
                }
                tempArray_1.push(tempArray_2)
            }
            board.push(tempArray_1)
        }
        this.setState({
            board: board,
            vanish: vanish,
            areaHeight,
            areaWidth,
            playerPosition
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setPlayer(nextProps)
    }

    setPlayer(props) {
        let {
            playerNumber,
            playerPosition,
            prevPlayerPos,
            boardHeight,
            boardWidth,
            areaHeight,
            areaWidth
        } = props
        let {
            board,
            vanish,
            entityStates
        } = this.state
        let px, py, nx, ny, vanishNum = boardHeight + boardWidth - 2
        for (let i = 0; i < playerNumber; i++) {
            px = prevPlayerPos[i].x
            py = prevPlayerPos[i].y
            board[Math.floor(py / areaHeight)][Math.floor(px / areaWidth)][py % areaHeight][px % areaWidth] = entityStates.empty
        }
        for (let i = 0; i < playerNumber; i++) {
            nx = playerPosition[i].x
            ny = playerPosition[i].y
            board[Math.floor(ny / areaHeight)][Math.floor(nx / areaWidth)][ny % areaHeight][nx % areaWidth] = entityStates.player + i
            if (Math.floor(ny / areaHeight) + Math.floor(nx / areaWidth) - 1 < vanishNum) vanishNum = Math.floor(ny / areaHeight) + Math.floor(nx / areaWidth) - 1
        }
        for (let i = 0; i <= vanishNum; i++) vanish[i] = true
        this.setState({
            board: board,
            playerPosition
        })
    }

    render() {
        let {
            playerPosition,
            playerFacing
        } = this.props
        let {
            board,
            vanish,
            entityStates
        } = this.state
        let playerImg = [
            [man_1_back, man_1_front, man_1_left, man_1_right],
            [man_2_back, man_2_front, man_2_left, man_2_right],
            [man_3_back, man_3_front, man_3_left, man_3_right],
            [man_4_back, man_4_front, man_4_left, man_4_right]
        ]
        console.log(board);
        return(
            <div>
                {board.map(function(boardRow, i) {
                    return (
                        <tr>
                            {boardRow.map(function(area, j) {
                                let entrance_img = blue_entrance_img
                                let background = red_floor
                                if ((i + j) % 2 === 0) {
                                    entrance_img = red_entrance_img
                                    background = blue_floor
                                }
                                if (vanish[i + j]) {
                                    entrance_img = empty_img
                                    background = vanish_img
                                }
                                return (
                                    <td
                                        style = {
                                            {
                                                backgroundImage: `url(${background})`,
                                                textAlign: "center",
                                                verticalAlign: "middle"
                                            }
                                        }
                                    >
                                        <table
                                            className = "area"
                                            cellSpacing = "0"
                                            id = "table"
                                            border = "2px"
                                            width = "100"
                                            height = "100"
                                            textAlign = "center"
                                            RULES = "NONE"
                                            bordercolor = "black"
                                        >
                                            <tbody>
                                                {area.map(function(areaRow) {
                                                return (
                                                    <tr>
                                                    {areaRow.map(function(cell) {
                                                        let obj_img = empty_img
                                                        if (background === vanish_img) obj_img = empty_img
                                                        else if (cell === entityStates.entrance) obj_img = entrance_img
                                                        else if (cell >= entityStates.player) obj_img = playerImg[cell - entityStates.player][playerFacing[cell - entityStates.player]]
                                                        return (
                                                            <td className = "area">
                                                                <img align="center" height="15" width="15" src={obj_img}/>
                                                            </td>
                                                        )
                                                    })}
                                                    </tr>
                                                );
                                                })}
                                            </tbody>
                                        </table>
                                    </td>
                                )
                            })}
                            <td style = {{backgroundImage: `url(${black_floor})`}}>
                                <table
                                    cellSpacing = "0"
                                    border = "0px"
                                    width = "105"
                                    height = "100"
                                    style = {{backgroundImage: `url(${fire})`}}
                                >
                                </table>
                            </td>
                        </tr>
                    );
                    })}
            </div>
        )
    }
}

export default GameBoard