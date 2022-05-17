import { Box, Flex, FormLabel, HStack, Input } from '@chakra-ui/react';
import React from 'react';
import { createRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { FC } from 'react';
import { PaintToolsProps } from '../types/paint-tools-types';

const NUMBER_OF_PIXELS = 16;
const CANVAS_SIZE = 400;
const PIXEL_SIZE = CANVAS_SIZE / NUMBER_OF_PIXELS;

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

// TODO: Refactor mouse down logic. Should be able to click on a pixel.
const DrawCanvas: FC = () => {
  const [color, setColor] = useState('#000');
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const canvasRef: React.Ref<HTMLCanvasElement> = createRef();

  useEffect(() => {
    const canvasContext: CanvasRenderingContext2D | null | undefined =
      canvasRef?.current?.getContext('2d');
    if (!canvasContext) return;
    canvasContext.strokeStyle = '#111';
    // Draw grid lines.
    // TODO: Switch to use a provided canvas height and width (i.e., no assumption)
    // of square canvas.
    for (let i = 0; i < NUMBER_OF_PIXELS; ++i) {
      // Draw horizontal line.
      const xPos: number = Math.floor((i * CANVAS_SIZE) / NUMBER_OF_PIXELS);
      canvasContext.beginPath();
      canvasContext.moveTo(xPos, 0);
      canvasContext.lineTo(xPos, CANVAS_SIZE);
      canvasContext.stroke();

      // Draw vertical line.
      const yPos: number = Math.floor((i * CANVAS_SIZE) / NUMBER_OF_PIXELS);
      canvasContext.beginPath();
      canvasContext.moveTo(0, yPos);
      canvasContext.lineTo(CANVAS_SIZE, yPos);
      canvasContext.stroke();
    }
  }, [canvasRef]);

  const drawOnPixel = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef || !canvasRef.current) return;
    const canvasContext: CanvasRenderingContext2D | null =
      canvasRef.current.getContext('2d');
    if (mouseIsDown && canvasContext) {
      const canvasPositionX: number = e.clientX - e.currentTarget.offsetLeft;
      const canvasPositionY: number = e.clientY - e.currentTarget.offsetTop;
      const [pixelX, pixelY] = [
        Math.floor(canvasPositionX / PIXEL_SIZE),
        Math.floor(canvasPositionY / PIXEL_SIZE),
      ];

      console.log(`${pixelX}, ${pixelY}`);

      canvasContext.fillStyle = color;
      canvasContext.fillRect(
        pixelX * PIXEL_SIZE,
        pixelY * PIXEL_SIZE,
        PIXEL_SIZE - 1,
        PIXEL_SIZE - 1
      );
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
      <Flex justifyContent={'center'}>
        <canvas
          width={`${CANVAS_SIZE}vw`}
          height={`${CANVAS_SIZE}vw`}
          style={{
            background: '#ccc',
            border: 'solid black 2px',
          }}
          ref={canvasRef}
          onMouseDown={onBeginDraw}
          onMouseUp={onFinishDraw}
          onMouseMove={onDraw}
        ></canvas>
      </Flex>
    </>
  );
};

export default DrawCanvas;
