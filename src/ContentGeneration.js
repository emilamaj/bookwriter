// This component is the third step of the app. It allows the user to select a particular item of the book and generate the content for it. There is a button to go back.

import React from "react";
import './ContentGeneration.css';

const ContentGenerationView = ({ bookData, selectItem, selectPart, deletePart, genParts, genContent, previousStep }) => {

    return (
        <div className="container-content">
            <div className="content-top">
                <p className="content-title">Content Generation</p>
            </div>

            <div className="container-content-middle">
                <div className="container-content-outline">
                    {bookData.chapters.map((chap, index) => (
                        <div key={index}>
                            <p className={"label-chapter label-outline" + (bookData.selectedChapter === index ? " label-selected" : "")}
                            >{index + 1}. {chap}</p>
                            {bookData.sections[index].map((sect, jindex) => (
                                <div key={jindex}>
                                    <p className={"label-section label-outline" + (bookData.selectedChapter === index && bookData.selectedSection === jindex ? " label-selected" : "")}
                                    >{jindex + 1}. {sect}</p>
                                    {bookData.items[index][jindex].map((item, kindex) => (
                                        <div key={kindex}>
                                            <p className={"label-item label-outline" + (bookData.selectedChapter === index && bookData.selectedSection === jindex && bookData.selectedItem === kindex ? " label-selected" : "")} onClick={() => selectItem(index, jindex, kindex)}
                                            >{kindex + 1}. {item}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="container-content-generation">
                    <div className="container-gen">
                        <button className={"button-content" + (bookData.isGenParts ? " button-waiting" : "")} type="button" disabled={bookData.isGenParts} onClick={genParts}>{bookData.isGenParts ? "Generating..." : "Parts"}</button>
                        <div className="container-parts">
                            {
                                (bookData.selectedChapter != null) && (bookData.selectedSection != null) && (bookData.selectedItem != null) ?
                                    bookData.parts[bookData.selectedChapter][bookData.selectedSection][bookData.selectedItem].map((part, index) => (
                                        <div className="container-part-single" key={index}>
                                            <button className="button-part-delete" type="button" onClick={() => deletePart(index)}>x</button>
                                            <p className={"label-part" + (bookData.selectedPart === index ? " label-selected" : "")} onClick={() => selectPart(index)}
                                            >{part}</p>
                                        </div>
                                    ))
                                    :
                                    <p className="label-part">Select an item</p>
                            }
                        </div>
                    </div>
                    <div className="container-gen">
                        <button className={"button-content" + (bookData.isGenContent ? " button-waiting" : "")} type="button" disabled={bookData.isGenContent} onClick={genContent}>{bookData.isGenContent ? "Generating..." : "Content"}</button>
                        {/* <textarea className="input-content" type="text" name="content" value={bookData.content[bookData.selectedChapter]?.[bookData.selectedSection]?.[bookData.selectedItem]?.[bookData.selectedPart] ?? 'Select part'} /> */}
                        <textarea
                            className="input-content"
                            type="text"
                            name="content"
                            value={
                                bookData.content[bookData.selectedChapter] &&
                                    bookData.content[bookData.selectedChapter][bookData.selectedSection] &&
                                    bookData.content[bookData.selectedChapter][bookData.selectedSection][bookData.selectedItem] &&
                                    bookData.content[bookData.selectedChapter][bookData.selectedSection][bookData.selectedItem][bookData.selectedPart]
                                    ? bookData.content[bookData.selectedChapter][bookData.selectedSection][bookData.selectedItem][bookData.selectedPart]
                                    : 'Select part'
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="content-bottom">
                <button className="button-content" type="button" onClick={previousStep}>Prev.</button>
                {/* <button className={"button-content" + (bookData.isGenFull ? " button-waiting":"")} type="button">Full Generation</button>
                <button className={"button-content" + (bookData.isGenFull ? " button-waiting":"")} type="button">Download</button> */}
            </div>
        </div>
    );
}

export default ContentGenerationView;
