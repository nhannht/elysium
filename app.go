package main

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"github.com/yuin/goldmark"
	"os"
)

// Global state struct

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) ConvertMdToHTML(html string) string {
	var buf bytes.Buffer
	if err := goldmark.Convert([]byte(html), &buf); err != nil {
		panic(err.Error())
	}
	return buf.String()
}

func (a *App) ReadFileFromDialog() string {
	options := runtime.OpenDialogOptions{
		Title: "Open File",
	}

	fileLocation, err := runtime.OpenFileDialog(a.ctx, options)
	if err != nil {
		return err.Error()
	}
	// Read file content
	file, err := os.OpenFile(fileLocation, os.O_RDWR, 0644)
	if err != nil {
		return err.Error()
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			println(err.Error())
		}
	}(file)
	currentFile = fileLocation
	scanner := bufio.NewScanner(file)
	var content string
	for scanner.Scan() {
		content += scanner.Text() + "\n"
		println(scanner.Text())
	}
	if err := scanner.Err(); err != nil {
		return err.Error()
	}
	return content
}
