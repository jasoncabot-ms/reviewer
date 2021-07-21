
import React from "react";
import {
    Link,
    useParams
} from "react-router-dom";
import { useFetch } from './../providers/fetchProvider';
import { ReviewCard } from './ReviewCard';

export const ItemDetails = () => {
    const { id } = useParams();
    const { loading, data } = useFetch(`${window.ENV.API_ENDPOINT}/Items/${id}`);

    if (loading) {
        return (<div className="container mt-5">Loading...</div>);
    } else {
        return (
            <div className="container mt-5">
                <div className="container">
                    <h1>{data.name}</h1>
                    <img src={data.imageURI} alt="{data.name}" className="img-fluid" />
                    <div>{data.description}</div>
                </div>
                <div className="container mt-5">
                    <h2>Reviews</h2>
                    <Link to={"/items/" + id + "/review"} className="btn btn-primary mt-3 mb-3">Add Review</Link>
                    {(data.reviews ?? []).map((review) => <ReviewCard key={review.id} review={review} />)}
                </div>
            </div>
        );
    }
}
