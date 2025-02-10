/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  Circle,
  Download,
  Eraser,
  Grab,
  Pen,
  Save,
  Square,
  Type,
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

const Page = () => {
  const canvasRef = useRef(null);
  const router = useRouter();
  const { theme } = useTheme();
  const [canvas, setCanvas] = useState(null);
  const [title, setTitle] = useState("untitled");
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    if (theme === "dark") {
      setColor(theme === "dark" ? "#ffffff" : "#000000");
    }
    if (!canvasRef.current) return;
    const newCanvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
    });

    newCanvas.setWidth(window.innerWidth - 100);
    newCanvas.setHeight(window.innerHeight - 100);
    newCanvas.freeDrawingBrush = new PencilBrush(newCanvas);
    newCanvas.freeDrawingBrush.color = color;
    newCanvas.freeDrawingBrush.width = 3;
    newCanvas.renderAll();
    setCanvas(newCanvas);

    return () => {
      newCanvas.dispose();
      setCanvas(null);
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;

    if (tool === "pen") {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = 3;
    } else {
      canvas.isDrawingMode = false;
      canvas.forEachObject((obj) => (obj.selectable = true)); // Enable selection
    }

    canvas.requestRenderAll();
  }, [tool, color, canvas]);

  useEffect(() => {
    if (!canvas) return;

    canvas.on("path:created", () => {
      canvas.renderAll();
    });
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.setWidth(window.innerWidth - 100);
      canvas.setHeight(window.innerHeight - 100);
      canvas.renderAll();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [canvas]);

  const addRectangle = () => {
    if (!canvas) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: color,
      stroke: "black",
      strokeWidth: 2,
      width: 100,
      height: 100,
      selectable: true,
      evented: true,
    });
    setTool("Selection");
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new FCircle({
      left: 100,
      top: 100,
      fill: color,
      stroke: "black",
      strokeWidth: 2,
      radius: 50,
      selectable: true,
      evented: true,
    });
    setTool("Selection");
    canvas.add(circle);
    canvas.setActiveObject(circle);
  };

  const addText = () => {
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
    setTool("Selection");
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const clearCanvas = () => {
    if (!canvas) return;

    canvas.isDrawingMode = true;
    const brush = new PencilBrush(canvas);

    brush.color = "rgba(0,0,0,0)"; // Fully transparent brush
    brush.width = 20; // Adjust eraser size

    brush.onMouseUp = function () {
      const objects = canvas.getObjects();
      objects.forEach((obj) => {
        if (
          obj.type === "path" &&
          obj.intersectsWithObject(canvas.getActiveObject())
        ) {
          canvas.remove(obj); // Remove only the intersecting object
        }
      });
      canvas.renderAll();
    };

    canvas.freeDrawingBrush = brush;
  };

  const saveSketch = async () => {
    try {
      if (!canvas) return;
      const { data } = await saveNotebook({
        type: "sketch",
        title: title,
        content: canvas.toJSON(),
      });
      if (data.success) {
        toast.success("Sketch saved!");
        router.push("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const downloadSketch = (type) => {
    if (!canvas) return;

    const link = document.createElement("a");
    if (type === "png") {
      const dataURL = canvas.toDataURL({
        format: "pdf",
        quality: 1.0,
      });
      link.href = dataURL;
      link.download = "sketch.png";
    } else {
      const pdf = new jsPDF("landscape", "mm", "a4");
      const canvasDataURL = canvas.toDataURL("image/png");

      const imgWidth = 297;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;

      pdf.addImage(canvasDataURL, "PNG", 10, 10, imgWidth - 20, imgHeight);

      pdf.save("sketch.pdf"); // Download PDF file
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid place-items-center gap-4 py-4">
      <div className={`flex justify-between w-full px-20`}>
        <div>
          <Link href="/dashboard">
            <Button variant="">
              <ArrowLeft /> Back
            </Button>
          </Link>
        </div>
        <div className="flex gap-4">
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
        <div>
          <ModeToggle />
        </div>
      </div>
      <div className="flex justify-around items-center w-full">
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
