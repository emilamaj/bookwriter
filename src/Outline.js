// This component is the second step of the app. It allows the user to view the chapters and sections of the book. There is a button to go back and one to go to the content generation.
// When the user clicks on the "Generate" button, text of the button changes while the content is being generated. When the content is generated, the button changes back to "Generate".

import React from "react";
import "./Outline.css";

const OutlineView = ({bookData, genOutline, changeOutline, parseOutline, previousStep, nextStep}) => {
    
    return (
        <div className="container-outline">
            <p className="outline-title">Book Outline</p>
            <div className="container-outline-text">
                <label className="label-text">Raw Outline</label>
                <textarea className="input-outline" type="text" name="rawOutline" value={bookData.rawOutline} onChange={changeOutline}/>
            </div>
            <div className="container-outline-parsed">
                <label className="label-parsed">Parsed Outline</label>
                <div className="container-outline-labels">
                    {bookData.chapters.map((chap, index) => (
                        <div key={index}>
                            <p className="label-chapter">{index+1}. {chap}</p>
                            {bookData.sections[index].map((sect, jindex) => (
                                <div key={jindex}>
                                    <p className="label-section">{jindex+1}. {sect}</p>
                                    {bookData.items[index][jindex].map((item, kindex) => (
                                        <div key={kindex}>
                                            <p className="label-item-outline">{kindex+1}. {item}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="outline-bottom">
                <button className="button-outline" type="button" onClick={previousStep}>Prev.</button>
                <button className={"button-outline"  + (bookData.isGenOutline ? " button-waiting":"")} type="button" disabled={bookData.isGenOutline} onClick={genOutline}>{bookData.isGenOutline ? "Generating...":"Generate"}</button>
                <button className="button-outline" type="button" onClick={parseOutline}>Parse</button>
                <button className="button-outline" type="button" onClick={nextStep}>Next</button>
            </div>
        </div>
    );
}

export default OutlineView;
