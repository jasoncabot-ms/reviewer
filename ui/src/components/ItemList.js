
import React from "react";
import {
    Link
} from "react-router-dom";
import { useFetch } from './../providers/fetchProvider';

const ItemListItem = ({ item: { id, name, imageURI, description, reviews } }) => {
    reviews = (reviews ?? []);
    return (
        <div key={id} className="card ml-5 mt-5" style={{ width: '18rem' }}>
            <img src={imageURI} alt="{name}" className="card-img-top" />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
                <div>
                    {reviews.length > 0 ?
                        <span>
                            Rated {reviews.map(r => r.rating).reduce((total, current) => { return total += current }, 0) / reviews.length}/5 from {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                        </span> :
                        <span>No reviews yet</span>}
                </div>
            </div>
            <Link to={"/items/" + id} className="btn btn-primary">View</Link>
        </div >
    );
}

export const ItemList = () => {
    const { loading, data } = useFetch(`${process.env.REACT_APP_API_ENDPOINT}/Items`);

    return (
        <div className="container">
            <div className="row">
                {loading ? <div>Loading...</div> :
                    data.map(item => (<ItemListItem key={item.id} item={item} />))
                }
            </div>
        </div>
    );
}
