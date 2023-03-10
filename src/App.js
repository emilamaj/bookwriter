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
		chapters: ["Example chapter"], // Array of strings containing the names of the chapters
		sections: [["Click to generate outline"]], // 2D array containing the names of the sections of each chapter
		items: [], // 3D array containing the names of the items of each section of each chapter
		content: [], // 3D array containing the content corresponding to each item of each section of each chapter
	});
	const [currentView, setCurrentView] = useState(0);

	const generateOutline = async () => {
		const { title, description } = book;
		let prompt = `Generate the Outline for the chapters and sections of the book "${title}".\n`;
		prompt += `The description of the book is: ${description}\n`;
		prompt += "The result should be formatted as follows:\n";
		prompt += "Chapters 3. Some chapter's name\n";
		prompt += "-Section 1: Title of section 1 of chapter 3\n";
		prompt += "\nTry to generate at least 5 sections per chapter if possible.\n";
		
		console.log("Prompt: ", prompt)
		const resultPromise = Utils.fetchPromptResult(prompt);
		resultPromise.finally(() => {
			console.log("Prompt closed");
		});
		let result = await resultPromise;
		let parsedOutline = Utils.parseChaptersSections(result);
		console.log("Parsed outline: ", parsedOutline)
		setBook({
			...book,
			chapters: parsedOutline.chapters,
			sections: parsedOutline.sections,
		});
	};

	// This function handles onChange on the input fields of the DescriptionView component
	const updateBook = (event) => {
		const { name, value } = event.target;
		setBook({ ...book, [name]: value });
	};
		

	const views = [
		<DescriptionView bookInfo={book} handleChange={updateBook} nextStep={() => {setCurrentView(currentView+1)}} />,
		<OutlineView bookData={book} genOutline={generateOutline} previousStep={() => {setCurrentView(currentView-1)}} nextStep={() => {setCurrentView(currentView+1)}}/>,
		<ContentGenerationView updateBook={updateBook} />,
	];

	return <div className='container-app'>
		{views[currentView]}
	</div>;
}


export default App;
