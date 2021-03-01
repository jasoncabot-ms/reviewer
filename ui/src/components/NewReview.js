
import React from "react";
import { useParams } from "react-router";
import { send } from "../providers/fetchProvider";

export const NewReview = () => {
    const { id } = useParams();
    return (
        <div className="container mt-10">
            <h1>What did you think?</h1>
            <ReviewForm itemId={parseInt(id, 10)} />
        </div>
    );
}

class ReviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemId: props.itemId,
            text: '',
            rating: undefined
        };

        this.onTextUpdated = this.onTextUpdated.bind(this);
        this.onRatingUpdated = this.onRatingUpdated.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onTextUpdated(event) {
        this.setState({ text: event.target.value });
    }
    onRatingUpdated(event) {
        this.setState({ rating: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("POST TO URL");

        send(`${process.env.REACT_APP_API_ENDPOINT}/Reviews`, JSON.stringify(this.state, null, 0));
    }

    render() {
        return (
            <form autoComplete="off" onSubmit={this.handleSubmit}>

                <div className="form-group">
                    <label>
                        Rating:
                    <input className="form-control" type="number" name="rating" min="1" max="5" value={this.state.description} onChange={this.onRatingUpdated} />
                    </label>
                </div>

                <div className="form-group">
                    <label>Text: </label>
                    <textarea className="form-control rounded-0" rows="10" value={this.state.text} onChange={this.onTextUpdated}></textarea>
                </div>


                <button type="submit" className="btn btn-primary">Submit</button>
            </form >
        );
    }
}