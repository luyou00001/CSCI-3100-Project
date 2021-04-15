import React, {
    Component
} from 'react';
import GameBoard from './GameBoard'
import _ from 'lodash'
import KeyHandler, {KEYDOWN} from 'react-key-handler';

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showGameBoard: false,
            gameOver: false,
            gameTime: 0,
            playerIndex: 0,
            startTime: 0,
            currentTime: 0,
            timePass: 0,
            boardHeight: 0,
            boardWidth: 0,
            areaHeight: 0,
            areaWidth: 0,
            randomEntrances: [],
            playerID: [],
            playerName: [],
            preScore: [],
            playerScore: [],
            playerLevel: [],
            levelCounter: [],
            ranking: [0, 1, 2, 3],
            playerNumber: 0,
            playerFacing: [],
            playerPosition: [],
            prevPlayerPos: []
        }
        this.initializeBoardPlayer = this.initializeBoardPlayer.bind(this)
        this.startGame = this.startGame.bind(this)
        this.setRanking = this.setRanking.bind(this)
        this.setEntrances = this.setEntrances.bind(this)
        this.setTime = this.setTime.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyRight = this.handleKeyRight.bind(this)
        this.handleKeyLeft = this.handleKeyLeft.bind(this)
        this.makeMove = this.makeMove.bind(this)
    }

    componentWillMount() {
        this.initializeBoardPlayer()
    }

    initializeBoardPlayer() {
        let gameTime = 30
        let boardWidth = 5
        let boardHeight = 5
        let areaWidth = 5
        let areaHeight = 5
        let playerNumber = 1
        let playerName = ["Robot_0", "Robot_1", "Robot_2", "Robot_3"]
        let preScore = [1000, 1000, 1000, 1000]
        let playerScore = [1000, 1000, 1000, 1000]
        let playerPosition = []
        let prevPlayerPos = []
        let playerFacing = []
        let playerLevel = []
        let levelCounter = []
        let startTime = 0
        let currentTime = 0
        let nowTime = new Date()
        startTime = nowTime.getHours() * 3600000 + nowTime.getMinutes() * 60000 + nowTime.getSeconds() * 1000 + nowTime.getMilliseconds()
        for (let i = 0; i < boardWidth + boardHeight - 1; i++) levelCounter.push([])
        for (let i = 0; i < playerNumber; i++) {
            playerFacing.push(1)
            playerPosition.push({x: Math.floor(areaWidth / 2), y: Math.floor(areaHeight / 2)})
            prevPlayerPos.push({x: Math.floor(areaWidth / 2), y: Math.floor(areaHeight / 2)})
        }
        //
        playerPosition[0].x += 15
        playerPosition[0].y += 20
        //
        let level = 0
        for (let i = 0; i < playerNumber; i++) {
            level = Math.floor(playerPosition[i].x / areaWidth) + Math.floor(playerPosition[i].y / areaHeight)
            playerLevel.push(level)
            levelCounter[level].push(i)
        }
        this.setState({
            gameTime: gameTime,
            boardHeight: boardHeight,
            boardWidth: boardWidth,
            areaWidth: areaWidth,
            areaHeight: areaHeight,
            playerNumber: playerNumber,
            playerName: playerName,
            preScore: preScore,
            playerScore: playerScore,
            playerFacing: playerFacing,
            playerPosition: playerPosition,
            prevPlayerPos: prevPlayerPos,
            playerLevel: playerLevel,
            levelCounter: levelCounter,
            startTime: startTime,
            currentTime: currentTime,
            showGameBoard: true
        }, () => {
            this.startGame()
        })
    }

    startGame() {
        this.setEntrances()
        this.setRanking()
        this.setTime()
    }

    setEntrances() {
        let {
            randomEntrances,
            boardHeight,
            boardWidth
        } = this.state
        let randomValues
        for (let i = 0; i < boardHeight; i++) {
            for (let j = 0; j < boardWidth; j++) {
                randomEntrances.push([])
                let entranceDifferences = [[1, -1], [1, 0], [0, 1], [-1, 1]]
                let temp = 4
                while (temp > 0) {
                    randomValues = Math.floor(Math.random() * temp)
                    let targetWidth = j + entranceDifferences[randomValues][0]
                    let targetHeight = i + entranceDifferences[randomValues][1]
                    if (targetWidth < 0 || targetWidth >= boardHeight || targetHeight < 0 || targetHeight >= boardHeight) {
                        randomEntrances[j + i * boardWidth].push([])
                        randomEntrances[j + i * boardWidth][4 - temp].push(j)
                        randomEntrances[j + i * boardWidth][4 - temp].push(i)
                    }
                    else {
                        randomEntrances[j + i * boardWidth].push([])
                        randomEntrances[j + i * boardWidth][4 - temp].push(targetWidth)
                        randomEntrances[j + i * boardWidth][4 - temp].push(targetHeight)
                    }
                    temp--
                    entranceDifferences.splice(randomValues, 1)
                }
            }
        }
        this.setState({
            randomEntrances
        })
    }

    setTime() {
        let {
            gameTime,
            startTime,
            currentTime,
            timePass,
            gameOver
        } = this.state
        let nowTime = new Date()
        currentTime = nowTime.getHours() * 3600000 + nowTime.getMinutes() * 60000 + nowTime.getSeconds() * 1000 + nowTime.getMilliseconds()
        timePass = Math.floor((currentTime - startTime) / 1000)
        if (timePass >= gameTime + 5) {
            gameOver = true
        }
        this.setState({
            currentTime: currentTime,
            timePass: timePass,
            gameOver: gameOver
        })
    }
    
    componentDidMount() {
        this.interval = setInterval(this.setTime, 10);
    }

    setRanking() {
        let {
            playerLevel,
            levelCounter,
            playerNumber,
            ranking
        } = this.state
        let maxLevel = 0, count = 0, length
        ranking = []
        let ranked = []
        for (let i = 0; i < playerNumber; i++) {
            if (playerLevel[i] > maxLevel) maxLevel = playerLevel[i]
            ranked.push(false)
        }
        for (let i = maxLevel; i >= 0; i--) {
            if (count === playerNumber) break
            length = levelCounter[i].length
            for (let j = 0; j < length; j++) {
                if (ranked[levelCounter[i][j]] === false) {
                    ranked[levelCounter[i][j]] = true
                    ranking.push(levelCounter[i][j])
                    count++
                }
            }
        }
        this.setState({
            ranking
        })
    }

    handleKeyUp(e) {
        e.preventDefault()
        let {
            gameTime,
            playerPosition,
            areaHeight,
            boardWidth,
            boardHeight,
            playerFacing,
            playerIndex,
            timePass,
            playerLevel,
            gameOver
        } = this.state
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= gameTime + 4 && timePass > 3 && gameOver === false) {
            playerFacing[playerIndex] = 0
            if (Number(playerPosition[playerIndex].y) % areaHeight - 1 >= 0) this.makeMove(playerPosition[playerIndex].x, playerPosition[playerIndex].y - 1)
        }
    }

    handleKeyDown(e) {
        e.preventDefault()
        let {
            gameTime,
            playerPosition,
            areaHeight,
            boardWidth,
            boardHeight,
            playerFacing,
            playerIndex,
            timePass,
            playerLevel,
            gameOver
        } = this.state
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= gameTime + 4 && timePass > 3 && gameOver === false) {
            playerFacing[playerIndex] = 1
            if (Number(playerPosition[playerIndex].y) % areaHeight + 1 < areaHeight) this.makeMove(playerPosition[playerIndex].x, playerPosition[playerIndex].y + 1)
        }
    }

    handleKeyRight(e) {
        e.preventDefault()
        let {
            gameTime,
            playerPosition,
            areaWidth,
            boardWidth,
            boardHeight,
            playerFacing,
            playerIndex,
            timePass,
            playerLevel,
            gameOver
        } = this.state
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= gameTime + 4 && timePass > 3 && gameOver === false) {
            playerFacing[playerIndex] = 3
            if (Number(playerPosition[playerIndex].x) % areaWidth + 1 < areaWidth) this.makeMove(playerPosition[playerIndex].x + 1, playerPosition[playerIndex].y)
        }
    }

    handleKeyLeft(e) {
        e.preventDefault()
        let {
            gameTime,
            playerPosition,
            areaWidth,
            boardWidth,
            boardHeight,
            playerFacing,
            playerIndex,
            timePass,
            playerLevel,
            gameOver
        } = this.state
        if (playerLevel[playerIndex] < boardWidth + boardHeight - 2 && timePass <= gameTime + 4 && timePass > 3 && gameOver === false) {
            playerFacing[playerIndex] = 2
            if (Number(playerPosition[playerIndex].x) % areaWidth - 1 >= 0) this.makeMove(playerPosition[playerIndex].x - 1, playerPosition[playerIndex].y)
        }
    }

    makeMove(newX, newY) {
        let {
            gameTime,
            playerPosition,
            prevPlayerPos,
            randomEntrances,
            boardHeight,
            boardWidth,
            areaWidth,
            areaHeight,
            playerNumber,
            playerIndex,
            playerLevel,
            levelCounter,
            startTime,
            currentTime,
            timePass,
            gameOver
        } = this.state
        let prevPos = {
            x: playerPosition[playerIndex].x,
            y: playerPosition[playerIndex].y
        }
        prevPlayerPos[playerIndex] = prevPos
        let x = newX % areaWidth
        let y = newY % areaHeight
        if ((x === 0 && y === 0) || (x === areaWidth - 1 && y === 0) || (x === areaWidth - 1 && y === areaHeight - 1) || (x === 0 && y === areaHeight - 1)) {
            let temp
            if (x === 0 && y === 0) temp = 0
            else if (x === areaWidth - 1 && y === 0) temp = 1
            else if (x === areaWidth - 1 && y === areaHeight - 1) temp = 2
            else temp = 3
            let ax = Math.floor(newX / areaWidth), ay = Math.floor(newY / areaHeight)
            let tx = randomEntrances[ax + ay * boardWidth][temp][0] * areaWidth + Math.floor(areaWidth / 2)
            let ty = randomEntrances[ax + ay * boardWidth][temp][1] * areaHeight + Math.floor(areaHeight / 2)
            playerPosition[playerIndex].x = tx
            playerPosition[playerIndex].y = ty
            if (Math.floor(tx / areaWidth) === boardWidth - 1 && Math.floor(ty / areaHeight) === boardHeight - 1) {
                if (timePass < gameTime - 1) startTime = currentTime - (gameTime * 1000 - 1000)
            }
        }
        else {
            playerPosition[playerIndex].x = newX
            playerPosition[playerIndex].y = newY
        }
        let level = Math.floor(playerPosition[playerIndex].x / areaWidth) + Math.floor(playerPosition[playerIndex].y / areaHeight)
        if (level > playerLevel[playerIndex]){
            playerLevel[playerIndex] = level
            levelCounter[level].push(playerIndex)
        }
        gameOver = true
        for (let i = 0; i < playerNumber; i++) {
            if (playerLevel[i] < boardHeight + boardWidth - 2) gameOver = false
        }
        if (gameOver) startTime = currentTime - (gameTime * 1000 + 5000)
        this.setState({
            playerPosition,
            prevPlayerPos,
            playerLevel,
            levelCounter,
            startTime,
            gameOver
        })
        this.setRanking()
    }

    render() {

        let {
            ranking,
            preScore,
            playerScore,
            playerLevel,
            playerPosition,
            randomEntrances,
            boardWidth,
            boardHeight,
            areaWidth,
            areaHeight,
            gameOver
        } = this.state
        
        let status = '*Demo only* '
        let temp = Math.floor(playerPosition[0].x / areaWidth) + Math.floor(playerPosition[0].y / areaHeight) * boardWidth
        if (randomEntrances[temp]) {
            for (let i = 0; i < 4; i++) {
                if (i === 0) status += "Top-left Entrance: "
                if (i === 1) status += "Top-right Entrance: "
                if (i === 2) status += "Bottom-right Entrance: "
                if (i === 3) status += "Bottom-left Entrance: "
                status += '(' + randomEntrances[temp][i][0] + ', ' + randomEntrances[temp][i][1] + ') '
            }
        }
        
        if (gameOver) {
            let finishLevel = boardWidth + boardHeight - 2
            if (playerLevel[ranking[0]] === finishLevel) {
                playerScore[ranking[0]] = preScore[ranking[0]] + 2
            }
            if (playerLevel[ranking[1]] === finishLevel) {
                playerScore[ranking[1]] = preScore[ranking[1]] + 1
            }
            else {
                playerScore[ranking[1]] = preScore[ranking[1]] - 1
            }
            if (playerLevel[ranking[2]] === finishLevel) {
                playerScore[ranking[2]] = preScore[ranking[2]] - 1
            }
            else {
                playerScore[ranking[2]] = preScore[ranking[2]] - 3
            }
            if (playerLevel[ranking[3]] === finishLevel) {
                playerScore[ranking[3]] = preScore[ranking[3]] - 2
            }
            else {
                playerScore[ranking[3]] = preScore[ranking[3]] - 4
            }
        }

        return(
            <div className="game">
				<div className="hidden">invisible</div>
                <div className = "status">
                    {status}
                </div>
                <KeyHandler
                    keyEventName = {KEYDOWN}
                    keyValue = "ArrowUp"
                    onKeyHandle = {
                        this.handleKeyUp
                    }
                />
                <KeyHandler
                    keyEventName = {KEYDOWN}
                    keyValue = "ArrowDown"
                    onKeyHandle = {
                        this.handleKeyDown
                    }
                />
                <KeyHandler
                    keyEventName = {KEYDOWN}
                    keyValue = "ArrowRight"
                    onKeyHandle = {
                        this.handleKeyRight
                    }
                />
                <KeyHandler
                    keyEventName = {KEYDOWN}
                    keyValue = "ArrowLeft"
                    onKeyHandle = {
                        this.handleKeyLeft
                    }
                />

                {
                    this.state.showGameBoard &&
                        ( <GameBoard
                            gameTime = {
                                this.state.gameTime
                            }
                            boardWidth = {
                                this.state.boardWidth
                            }
                            boardHeight = {
                                this.state.boardHeight
                            }
                            areaWidth = {
                                this.state.areaWidth
                            }
                            areaHeight = {
                                this.state.areaHeight
                            }
                            playerIndex = {
                                this.state.playerIndex
                            }
                            playerNumber = {
                                this.state.playerNumber
                            }
                            playerName = {
                                this.state.playerName
                            }
                            preScore = {
                                this.state.preScore
                            }
                            playerScore = {
                                this.state.playerScore
                            }
                            playerFacing = {
                                this.state.playerFacing
                            }
                            playerPosition = {
                                this.state.playerPosition
                            }
                            prevPlayerPos = {
                                this.state.prevPlayerPos
                            }
                            playerLevel = {
                                this.state.playerLevel
                            }
                            ranking = {
                                this.state.ranking
                            }
                            startTime = {
                                this.state.startTime
                            }
                            currentTime = {
                                this.state.currentTime
                            }
                            totalMoves = {
                                this.state.totalMoves
                            }
                            gameOver = {
                                this.state.gameOver
                            }
                            />)
                }
				<div className="hidden">invisible</div>
            </div>
        )
    }
}

export default Game;
