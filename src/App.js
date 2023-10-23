// This is the main component of the app. It handles the state of the app and renders the appropriate view based on the currentView state.

import React, { useState } from 'react';
import DescriptionView from './Description';
import OutlineView from './Outline';
import ContentGenerationView from './ContentGeneration';
import Utils from './Utils';
import './App.css';

function App() {
	const [book, setBook] = useState({
		title: 'Mathematics of quantitative finance',
		description: 'Written for STEM students and professionals, this book provides extensive coverage of the mathematics of quantitative finance.',
		rawOutline: '',
		chapters: ["Example chapter"], // Array of strings containing the names of the chapters
		sections: [["Click 'Generate' to generate outline"]], // 2D array containing the names of the sections of each chapter
		items: [[["Some item"]]], // 3D array containing the names of the items of each section of each chapter
		parts: [[[[""]]]], // 4D array containing the names of the parts of each item of each section of each chapter
		content: [[[[""]]]], // 4D array containing the content corresponding to each part of each item of each section of each chapter
		isGenOutline: false,
		isGenParts: false,
		isGenContent: false,
		selectedChapter: null,
		selectedSection: null,
		selectedItem: null,
		selectedPart: null,
	});
	const [currentView, setCurrentView] = useState(0);

	// Generate the outline of the book (chapters, sections, items)
	const generateOutline = async () => {
		let prompt = `Generate the Outline for the chapters, sections, and items of the sections of the book "${book.title}".\n`;
		prompt += `The description of the book is: ${book.description}\n`;
		prompt += "The result should be formatted as follows:\n";
		prompt += "# Outline\n";
		prompt += "Chapter 1. First chapter's name\n";
		prompt += "\tSection 1. Title of section 1 of chapter 1\n"; // Use of \t for indentation in case VSCode converts tabs to spaces
		prompt += "\t\t-Some item of the section\n";
		prompt += "\t\t-Another item\n";
		prompt += "\t\t-Some other matter addressed\n";
		prompt += "\t\t-A point about something\n";
		prompt += "\t\t-Some last point of the section\n";
		prompt += "\nTry to generate at least 5 sections per chapter, and 6 points per section, if possible.\n";
		
		setBook({
			...book,
			isGenOutline: true,
		});
		const resultPromise = Utils.fetchPromptResult(prompt);
		resultPromise.finally(() => {
			console.log("Received response.");
			setBook({
				...book,
				isGenOutline: false,
			});
		});
		let result = await resultPromise;
		// Remove all the lines before and including "# Outline"
		result = result.split("# Outline")[1];
		console.log("Raw outline: ", result)
		setBook({
			...book,
			rawOutline: result,
		});
	};

	// Parse the raw text into the outline
	const parseOutline = () => {
		let parsedOutline = Utils.parseOutline(book.rawOutline);
		console.log("Parsed outline: ", parsedOutline)
		setBook({
			...book,
			chapters: parsedOutline.chapters,
			sections: parsedOutline.sections,
			items: parsedOutline.items,
			parts: parsedOutline.parts,
			content: parsedOutline.content,
			selectedChapter: null,
			selectedSection: null,
			selectedItem: null,
			selectedPart: null,
		});
	};

	// Generate the parts of the selected item
	const generateParts = async () => {
		let prompt = `The book's name is "${book.title}".\n`;
		prompt += `The description of the book is "${book.description}"\n\n`;
		prompt += `Here is the subsection we are interested in:\n`;
		prompt += `Chapter ${book.selectedChapter + 1}. ${book.chapters[book.selectedChapter]}\n`;
		prompt += `\tSection ${book.selectedSection + 1}. ${book.sections[book.selectedChapter][book.selectedSection]}\n`;
		prompt += `\t\tSubsection ${book.selectedItem + 1}. ${book.items[book.selectedChapter][book.selectedSection][book.selectedItem]}\n\n`;
		prompt += `Give a list of the parts that should be included in the subsection "${book.items[book.selectedChapter][book.selectedSection][book.selectedItem]}".\n`;
		prompt += `The result should be formatted as follows:\n`;
		prompt += `-Introductory point\n`;
		prompt += `-Explanation of the point\n`;
		prompt += `-Another point\n`;
		prompt += `...\n`;
		
		setBook({
			...book,
			isGenParts: true,
		});
		const resultPromise = Utils.fetchPromptResult(prompt);
		resultPromise.finally(() => {
			console.log("Received response.");
			setBook({
				...book,
				isGenParts: false,
			});
		});
		let result = await resultPromise;
		let parsedParts = Utils.parseParts(result); // Returns an array with the parts of the selected item
		console.log("Parsed parts: ", parsedParts)

		// We update the book object with the new parts. book.parts is a 4D array, so we need to update the parts of the selected item.
		// We use the spread operator to copy the array, and then we update the selected item's parts.
		let newParts = [...book.parts];
		newParts[book.selectedChapter][book.selectedSection][book.selectedItem] = parsedParts;
		setBook({
			...book,
			parts: newParts,
			selectedPart: null,
		});
	};

	// Generate the content of the selected part
	const generateContent = async () => {
		let prompt = `The book's name is "${book.title}".\n`;
		prompt += `The description of the book is "${book.description}"\n\n`;
		prompt += `Write the content for the following part of the book:\n`;
		prompt += `-${book.parts[book.selectedChapter][book.selectedSection][book.selectedItem][book.selectedPart]}\n`;
		prompt += `The text must absolutely contain at least 1000 words !\n`;

		setBook({
			...book,
			isGenContent: true,
		});
		const resultPromise = Utils.fetchPromptResult(prompt);
		resultPromise.finally(() => {
			console.log("Received response.");
			setBook({
				...book,
				isGenContent: false,
			});
		});
		let result = await resultPromise;
		console.log("Result: ", result)

		// We update the book object with the new content. book.content is a 4D array, so we need to update the content of the selected part.
		// We use the spread operator to copy the array, and then we update the selected part's content.
		let newContent = [...book.content];
		newContent[book.selectedChapter][book.selectedSection][book.selectedItem][book.selectedPart] = result;
		setBook({
			...book,
			content: newContent,
		});
	};

	const selectItem = (chapterIndex, sectionIndex, itemIndex) => {
		console.log("Selecting item: ", chapterIndex, sectionIndex, itemIndex);
		setBook({
			...book,
			selectedChapter: chapterIndex,
			selectedSection: sectionIndex,
			selectedItem: itemIndex,
			selectedPart: null,
		});
	};

	const selectPart = (partIndex) => {
		console.log("Selecting part: ", partIndex);
		setBook({
			...book,
			selectedPart: partIndex,
		});
	};	

	const deletePart = (partIndex) => {
		console.log("Deleting part: ", partIndex);
		let newParts = [...book.parts];
		newParts[book.selectedChapter][book.selectedSection][book.selectedItem].splice(partIndex, 1);
		let newContent = [...book.content];
		newContent[book.selectedChapter][book.selectedSection][book.selectedItem].splice(partIndex, 1);
		setBook({
			...book,
			parts: newParts,
			content: newContent,
			selectedPart: null,
		});
	};

	// This function handles onChange on the input fields of the DescriptionView component
	const updateBook = (event) => {
		const { name, value } = event.target;
		setBook({ ...book, [name]: value });
	};

	// Component receive a function as a prop, but needs to pass a chapter, section, and item index to it.
	// const generateContent = (chapterIndex, sectionIndex, itemIndex) => {

	const views = [
		<DescriptionView bookInfo={book} handleChange={updateBook} nextStep={() => {setCurrentView(currentView+1)}} />,
		<OutlineView bookData={book} genOutline={generateOutline} changeOutline={updateBook} parseOutline={parseOutline} previousStep={() => {setCurrentView(currentView-1)}} nextStep={() => {setCurrentView(currentView+1)}}/>,
		<ContentGenerationView bookData={book} previousStep={() => {setCurrentView(currentView-1)}} genParts={generateParts} genContent={generateContent} selectItem={selectItem} selectPart={selectPart} deletePart={deletePart}/>,
	];

	return <div className='container-app'>
		{views[currentView]}
	</div>;
}


export default App;
