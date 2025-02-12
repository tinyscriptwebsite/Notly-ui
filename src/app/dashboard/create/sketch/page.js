/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  Circle,
  Download,
  Eraser,
  Grab,
  Pen,
  Redo,
  Save,
  Square,
  Type,
  Undo,
} from "lucide-react";
import toast from "react-hot-toast";
import { ModeToggle } from "@/components/ui/mode";
import Link from "next/link";
import { Canvas, PencilBrush, Circle as FCircle, Textbox, Rect } from "fabric";
import { useTheme } from "next-themes";
import { saveNotebook } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useLoader } from "@/hooks/useLoader";

const Page = () => {
  // canvas ref and state
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const router = useRouter();
  const { theme } = useTheme();
  const [title, setTitle] = useState("untitled");
  // loader hooks for manage loader
  const { startLoading, stopLoading } = useLoader();

  const saveCanvasState = () => {
    if (!canvas) return;
    const currentState = canvas.toJSON();
    setHistory((prevHistory) => [...prevHistory, currentState]);
    setRedoHistory([]); // Clear redo history when a new action is performed
  };

  useEffect(() => {
    // set color of pen according to theme
    if (theme === "dark") {
      setColor(theme === "dark" ? "#ffffff" : "#000000");
    }

    if (!canvasRef.current) return;
    // create new canvas
    const newCanvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
    });

    // set canvas width, height and brush
    newCanvas.setWidth(window.innerWidth - 100);
    newCanvas.setHeight(window.innerHeight - 100);
    newCanvas.freeDrawingBrush = new PencilBrush(newCanvas);
    newCanvas.freeDrawingBrush.color = color;
    newCanvas.freeDrawingBrush.width = 3;
    newCanvas.renderAll();
    setCanvas(newCanvas);

    // clean up the canvas when the component unmounts
    return () => {
      newCanvas.dispose();
      setCanvas(null);
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;

    // manage pen and selection
    if (tool === "pen") {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = 3;
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
      // added selection for all objects that create by users
      canvas.forEachObject((obj) => (obj.selectable = true));
    }
    canvas.requestRenderAll();
  }, [tool, color, canvas]);

  useEffect(() => {
    if (!canvas) return;

    // Save the canvas state when a path is created
    const handlePathCreated = () => {
      canvas.renderAll();
      saveCanvasState();
    };

    // Listen for the path:created event
    canvas.on("path:created", handlePathCreated);

    // Cleanup the event listener when the component unmounts
    return () => {
      canvas.off("path:created", handlePathCreated);
    };
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    // Resize the canvas when the window is resized
    const resizeCanvas = () => {
      canvas.setWidth(window.innerWidth - 100);
      canvas.setHeight(window.innerHeight - 100);
      canvas.renderAll();
    };

    // Listen for the window resize event and resize canvas
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [canvas]);

  // add rectangles shape
  const addRectangle = useCallback(() => {
    if (!canvas) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      stroke: color,
      fill: "transparent",
      strokeWidth: 3,
      width: 100,
      height: 100,
      selectable: true,
      evented: true,
    });

    // set active object and change tool
    setTool("Selection");
    canvas.add(rect);
    canvas.setActiveObject(rect);
  }, [canvas, color]);

  // add circle shape
  const addCircle = useCallback(() => {
    if (!canvas) return;
    const circle = new FCircle({
      left: 100,
      top: 100,
      stroke: color,
      fill: "transparent",
      strokeWidth: 3,
      radius: 50,
      selectable: true,
      evented: true,
    });

    // set active object and change tool
    setTool("Selection");
    canvas.add(circle);
    canvas.setActiveObject(circle);
  }, [canvas, color]);

  // add text
  const addText = useCallback(() => {
    if (!canvas) return;
    const text = new Textbox("Write here...", {
      left: 50,
      top: 50,
      width: 200,
      fontSize: 20,
      fill: color,
      editable: true,
      selectable: true,
      evented: true,
    });

    // set active object and change tool
    setTool("Selection");
    canvas.add(text);
    canvas.setActiveObject(text);
  }, [canvas, color]);

  // clear canvas and save
  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
    saveCanvasState();
  }, [canvas]);

  // save sketch in database
  const saveSketch = async () => {
    try {
      startLoading();
      if (!canvas) return;
      // saveNotebook api call using axios
      const { data } = await saveNotebook({
        type: "sketch",
        title: title,
        content: canvas.toJSON(),
      });
      // handle response
      if (data.success) {
        toast.success("Sketch saved!");
        router.push("/dashboard");
      } else {
        toast.error(data.message);
      }
      // handle error
    } catch (error) {
      toast.error(error.message);
      // handle finally and stop loading
    } finally {
      stopLoading();
    }
  };

  // download sketch as png or pdf
  const downloadSketch = (type) => {
    if (!canvas) return;

    const link = document.createElement("a");
    // download as png
    if (type === "png") {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1.0,
      });
      link.href = dataURL;
      link.download = "sketch.png";
      // download as pdf
    } else {
      const pdf = new jsPDF("landscape", "mm", "a4");
      const canvasDataURL = canvas.toDataURL("image/png");

      const imgWidth = 297;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;

      pdf.addImage(canvasDataURL, "PNG", 10, 10, imgWidth - 20, imgHeight);

      pdf.save("sketch.pdf");
    }
    // add link and click for download that file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // undo function for undo changes
  const undo = () => {
    if (history.length === 0 || !canvas) return;
    // get last state
    const lastState = history[history.length - 1];
    // remove last state
    setHistory((prev) => prev.slice(0, -1));
    // add last state to redo
    setRedoHistory((prev) => [lastState, ...prev]);
    // load last state
    if (history.length > 1) {
      // load last state in canvas
      canvas.loadFromJSON(history[history.length - 2], () => {
        setTimeout(() => {
          // render canvas
          canvas.renderAll();
        }, 0);
      });
    } else {
      // clear canvas
      canvas.clear();
      setTimeout(() => {
        // render canvas
        canvas.renderAll();
      }, 0);
    }
  };

  // redo function for redo changes
  const redo = () => {
    if (redoHistory.length === 0 || !canvas) return;
    // get next state
    const nextState = redoHistory[0];
    // remove next state
    setRedoHistory((prev) => prev.slice(1));
    // add next state to history
    setHistory((prev) => [...prev, nextState]);
    // load next state
    canvas.loadFromJSON(nextState, () => {
      setTimeout(() => {
        canvas.renderAll();
      }, 0);
    });
  };

  return (
    <div className="grid place-items-center gap-4 py-4">
      <div
        className={`flex justify-between items-center flex-wrap gap-4 w-full md:px-20 px-8`}
      >
        <Link href="/dashboard" className="md:w-fit w-full">
          <Button className="md:w-auto w-full">
            <ArrowLeft /> Back
          </Button>
        </Link>

        <div className="flex gap-4 md:justify-normal justify-center flex-wrap">
          <Button
            variant={tool === "pen" ? "default" : "outline"}
            size="icon"
            title="Pen"
            onClick={() => setTool("pen")}
          >
            <Pen />
          </Button>
          <Button
            variant={tool === "Selection" ? "default" : "outline"}
            size="icon"
            title="Select"
            onClick={() => setTool("Selection")}
          >
            <Grab />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Square"
            onClick={addRectangle}
          >
            <Square />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Circle"
            onClick={addCircle}
          >
            <Circle />
          </Button>
          <Button variant="outline" size="icon" title="Text" onClick={addText}>
            <Type />
          </Button>
          <Button
            variant={tool === "eraser" ? "default" : "outline"}
            size="icon"
            title="Erase"
            onClick={() => {
              setTool("eraser");
              clearCanvas();
            }}
          >
            <Eraser />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Save"
            onClick={saveSketch}
          >
            <Save />
          </Button>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size="icon" title="Download">
                  <Download />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
              >
                <DropdownMenuItem
                  onClick={() => downloadSketch("png")}
                  className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
                >
                  PNG
                </DropdownMenuItem>
                <DropdownMenuSeparator></DropdownMenuSeparator>
                <DropdownMenuItem
                  onClick={() => downloadSketch("pdf")}
                  className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
                >
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="w-fit md:mx-0 mx-auto">
          <ModeToggle />
        </div>
      </div>
      <div className="flex justify-around gap-4 flex-wrap items-center w-full">
        <div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              title="Undo"
              onClick={undo}
              disabled={history.length === 0}
            >
              <Undo />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Redo"
              onClick={redo}
              disabled={redoHistory.length === 0}
            >
              <Redo />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold">Title:</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded-lg border-none"
          />
        </div>
      </div>
      <div className="grid place-items-center">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "500px" }}
          className="rounded-lg mx-auto border"
        />
      </div>
    </div>
  );
};

export default Page;
