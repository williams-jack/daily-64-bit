import { Box, FormLabel, HStack, Input } from '@chakra-ui/react';
import React from 'react';
import { createRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { FC } from 'react';
import { PaintToolsProps } from '../types/paint-tools-types';

const NUMBER_OF_PIXELS = 32;
const CANVAS_SIZE = 500;

const PaintTools: FC<PaintToolsProps> = ({ setColor, color }) => {
  const colorInputRef: React.RefObject<HTMLInputElement> = createRef();
  const clickSelectColor: React.MouseEventHandler<HTMLDivElement> = (_) => {
    colorInputRef.current?.click();
  };
  const selectColor: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setColor(e.target.value);
  };

  return (
    <>
      <HStack justifyContent={'center'} mb={3}>
        <FormLabel>Brush Color:</FormLabel>
        <Box
          bg={color}
          onClick={clickSelectColor}
          width={'3vw'}
          height={'3vw'}
        ></Box>
        <Input
          type={'color'}
          variant={'unstyled'}
          width={'2vw'}
          height={'2vw'}
          display={'none'}
          ref={colorInputRef}
          onChange={selectColor}
          value={color}
        />
      </HStack>
    </>
  );
};

const DrawCanvas: FC = () => {
  const [color, setColor] = useState('#000');
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const canvasRef: React.Ref<HTMLCanvasElement> = createRef();

  useEffect(() => {
    const canvasContext: CanvasRenderingContext2D | null | undefined =
      canvasRef.current?.getContext('2d');
    const offset: number = CANVAS_SIZE / NUMBER_OF_PIXELS;
    let currentXPosition: number = 0;
    let currentYPosition: number = 0;
    // Draw horizontal lines.
    for (let i: number = 1; i <= NUMBER_OF_PIXELS; ++i) {
      currentXPosition = offset * i;
      canvasContext?.moveTo(currentXPosition, CANVAS_SIZE);
      canvasContext?.lineTo(currentXPosition, 0);
      canvasContext?.stroke();
    }
    for (let i: number = 1; i <= NUMBER_OF_PIXELS; ++i) {
      currentYPosition = offset * i;
      canvasContext?.moveTo(CANVAS_SIZE, currentYPosition);
      canvasContext?.lineTo(0, currentYPosition);
      canvasContext?.stroke();
    }
  }, [canvasRef]);

  const drawOnPixel = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mouseIsDown) {
      const canvasPositionX: number = e.clientX - e.currentTarget.offsetLeft;
      const canvasPositionY: number = e.clientY - e.currentTarget.offsetTop;
      console.log(`Pos X: ${canvasPositionX} PosY: ${canvasPositionY}`);
    }
  };

  const onBeginDraw: React.MouseEventHandler<HTMLCanvasElement> = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    setMouseIsDown(true);
    drawOnPixel(e);
  };

  const onDraw: React.MouseEventHandler<HTMLCanvasElement> = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (mouseIsDown) {
      drawOnPixel(e);
    }
  };

  const onFinishDraw: React.MouseEventHandler<HTMLCanvasElement> = () => {
    setMouseIsDown(false);
  };

  return (
    <>
      <PaintTools color={color} setColor={setColor} />
      <canvas
        width={`${CANVAS_SIZE}vw`}
        height={`${CANVAS_SIZE}vw`}
        style={{
          background: '#ccc',
          border: 'solid blue 2px',
        }}
        ref={canvasRef}
        onMouseDown={onBeginDraw}
        onMouseUp={onFinishDraw}
        onMouseMove={onDraw}
      ></canvas>
    </>
  );
};

export default DrawCanvas;
