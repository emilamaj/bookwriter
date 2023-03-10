// This component is the third step of the app. It allows the user to select a particular item of the book and generate the content for it. There is a button to go back.

import React from "react";
import './ContentGeneration.css';

const ContentGenerationView = ({bookData, genContent, previousStep}) => {
    
    return (
        <div className="container-content">
            <p className="content-title">Content Generation</p>
            <div className="container-content-text">
                <p className="label-chapter">{bookData.chapters[bookData.chapIndex]}</p>
                <p className="label-section">{bookData.sections[bookData.chapIndex][bookData.sectIndex]}</p>
                <p className="label-item">{bookData.items[bookData.chapIndex][bookData.sectIndex][bookData.itemIndex]}</p>
            </div>

            <div className="container-content-text">
                <p className="label-chapter">{bookData.content[bookData.chapIndex][bookData.sectIndex][bookData.itemIndex]}</p>
            </div>

            <div className="content-bottom">
                <button className="button-content" type="button" onClick={previousStep}>Prev.</button>
            </div>
        </div>
    );
}

export default ContentGenerationView;
