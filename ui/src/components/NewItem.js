
import React from "react";
import { send } from "../providers/fetchProvider";

export const NewItem = () => {
    return (
        <div className="container mt-10">
            <h1>Add Item</h1>
            <ItemForm />
        </div>
    );
}

class ItemForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: ''
        };

        this.onNameUpdated = this.onNameUpdated.bind(this);
        this.onDescriptionUpdated = this.onDescriptionUpdated.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.imageInput = React.createRef();
    }

    onNameUpdated(event) {
        this.setState({ name: event.target.value });
    }
    onDescriptionUpdated(event) {
        this.setState({ description: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", this.state.name);
        formData.append("description", this.state.description);
        formData.append("image", this.imageInput.current.files[0]);

        send(`${window.ENV.API_ENDPOINT}/Items`, formData);
    }

    render() {
        return (
            <form autoComplete="off" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label>
                        Name:
                    <input className="form-control" type="text" name="name" value={this.state.name} onChange={this.onNameUpdated} />
                    </label >
                </div>

                <div className="form-group">
                    <label>
                        Description:
                    <input className="form-control" type="text" name="description" value={this.state.description} onChange={this.onDescriptionUpdated} />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Image:
                    <input className="form-control" type="file" name="imageURI" ref={this.imageInput} />
                    </label>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form >
        );
    }
}