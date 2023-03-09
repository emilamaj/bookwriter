// This component is the second step of the app. It allows the user to view the chapters and sections of the book.

import React from "react";
import "./Outline.css";

const OutlineView = ({ bookData, nextStep }) => {
    return (
        <div className="container-form">
            <p className="form-title">Outline</p>
            <div className="container-outline-text">
                <ul>
                    {bookData.chapters.map((chap, index) => (
                        <li key={chap}>
                            <p className="label-chapter">{chap}</p>
                            <ul>
                                {bookData.sections[index].map((content) => (
                                    <li key={content}>
                                        <p className="label-section">{content}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="form-element-bottom">
                <button className="button-form" type="button" onClick={nextStep}>Generation</button>
            </div>
        </div>
    );
}

export default OutlineView;