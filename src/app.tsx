import * as React from "react";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

type SizeAttr = {
    size?: number
}

type GridAttr = {
    col?: number | boolean,
    row?: number | boolean,
    size?: number
}

const GridItem = styled.input<GridAttr>`
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.8);
  height: calc(100% - 1px);
  width: calc(100% - 5px);
  font-size: ${({ size }) => `calc(${22.5/size}vh + ${22.5/size}vh)`};
  text-align: center;
`;

const GridContainer = styled.div<SizeAttr>`
  display: grid;
  grid-template-columns: ${({ size }) => `repeat(${size}, 1fr)`};
  background-color: rgb(33, 150, 243);
  padding: 10px;
  height: 70vh;
  width: 70vw;
`;

const SizeInput = styled.input`
  width: 6vw;
  font-size: calc(2vw + 2vh);
`;

const BasicText = styled.a`
  font-size: calc(2vw + 2vh);
  color: white;
`;

const BasicButton = styled.button`
  width: 6vw;
  height: 6.5vh;
  font-size: calc(1.25vw + 1.25vh);
`

const BasicDropdown = styled.select`
  width: 15vw;
  height: 6.5vh;
  font-size: calc(1.25vw + 1.25vh);
`

const App: React.FC = () => {
    useEffect(() => {
        document.title = '마방진 v0.3';
    }, []);

    const [size, setSize] = useState("");

    const containerRef = useRef(null);

    const [squareData, setSquareData] = useState([])
    const sizeChange = (e: any) => {
        setSquareData([])
        const newSize = e.target.value;
        if (!isNaN(newSize) && newSize >= 0 && newSize <= 22) {
            setSize(newSize);
        }
    };

    const isCorrectSquare = (data: [[number]]) => {
        const usedNums: number[] = []
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if(usedNums.find((element) => element == data[i][j])){
                    return false
                }else{
                    usedNums.push(data[i][j])
                }
            }
        }

        let firstRowSum = 0;
        for (let i = 0; i < data.length; i++) {
            let rowSum = 0;
            for (let j = 0; j < data[i].length; j++) {
                rowSum += data[i][j];
            }

            if (i === 0) {
                firstRowSum = rowSum;
            } else {
                console.log(rowSum, firstRowSum);
                if (rowSum !== firstRowSum) {
                    return false;
                }
            }
        }

        const colSums: number[] = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if(!colSums[j]){
                    colSums[j]=0
                }
                colSums[j] = colSums[j] + data[i][j];
            }
        }

        const firstColSum = colSums[0]
        for (let i = 0; i < colSums.length; i++){
            if(firstColSum != colSums[i]){
                return false
            }
        }

        let diagonalSum = 0
        for (let i = 0; i < data.length; i++) {
            diagonalSum += data[i][i]
        }

        if (diagonalSum != firstColSum || diagonalSum != firstRowSum){
            return false
        }

        return true;
    };


    const gridItemChanged = (e: any) => {
        const newValue = e.target.value;

        if (!squareData[e.target.getAttribute("row") - 1]) {
            squareData[e.target.getAttribute("row") - 1] = []
        }

        squareData[e.target.getAttribute("row") - 1][e.target.getAttribute("col") - 1] = Number(newValue)

        if (squareData.length != e.target.size) {
            containerRef.current.style.backgroundColor = "rgb(33, 150, 243)";
        }

        for (let i = 0; i < squareData.length; i++) {
            if(!squareData[i] || squareData[i].length != e.target.size){
                containerRef.current.style.backgroundColor = "rgb(33, 150, 243)";
                return
            }
            for (let j = 0; j < squareData[i].length; j++) {
                if(!squareData[i][j] || typeof squareData[i][j] != "number"){
                    containerRef.current.style.backgroundColor = "rgb(33, 150, 243)";
                    return;
                }
            }
        }

        console.log(squareData)

        const correctSquare = isCorrectSquare(squareData as [[number]]);

        // Set the background color of the GridContainer based on isCorrectSquare result
        if (correctSquare) {
            containerRef.current.style.backgroundColor = "green";
        } else {
            containerRef.current.style.backgroundColor = "red";
        }
    }

    const generateGridItems = (size: number) => {
        const gridItems = [];

        for (let i = 0; i < size * size; i++) {
            gridItems.push(
                <GridItem key={i} size={size} row={Math.floor(i / size) + 1} col={(i+1)%size == 0 ? size : (i+1)%size} onChange={gridItemChanged} />
            );
        }

        return gridItems;
    };


    const getSolveOptions = () => {
        const options = [];

        if (Number(size) % 2 != 0){
            options.push(<option>홀수 차수</option>)
        }

        return options;
    }

    return (
        <main>
            <GridContainer ref={containerRef} size={Number(size)}>
                {generateGridItems(Number(size))}
            </GridContainer>

            <SizeInput id="size1" value={size} onChange={sizeChange}></SizeInput>
            <BasicText> x </BasicText>
            <SizeInput id="size2" value={size} onChange={sizeChange}></SizeInput>

            <BasicButton style={{ float: 'right' }}>풀기</BasicButton>
            <BasicDropdown name="푸는 방법" style={{ float: 'right' }}>
                {getSolveOptions()}
            </BasicDropdown>
        </main>
    );
};

export default App;
