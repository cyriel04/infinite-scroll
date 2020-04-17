import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

const InfiniteScroll = () => {
	const [data, setData] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [loading, setLoading] = useState(true);

	const url = 'https://randomuser.me/api/?results=10&';

	useEffect(() => {
		const fetchMyAPI = async () => {
			setLoading(true);
			const response = await axios.get(`${url}page=${pageNumber}`);
			setLoading(false);
			setData((prevData) => [...prevData, ...response.data.results]);
		};
		fetchMyAPI();
	}, [pageNumber]);

	const observer = useRef();

	const lastData = useCallback(
		(item) => {
			if (loading) {
				return;
			}
			if (observer.current) {
				observer.current.disconnect();
			}
			observer.current = new IntersectionObserver((res) => {
				if (res[0].isIntersecting) {
					setPageNumber((prevPageNumber) => prevPageNumber + 1);
				}
			});
			if (item) {
				observer.current.observe(item);
			}
		},
		[loading]
	);
	return (
		<div>
			<h1>Infinite Scroll</h1>
			<div className="container">
				{data.map((res, key) => {
					if (data.length === key + 1) {
						return (
							<div ref={lastData} className="item" key={key}>
								<p>{`${res.name.first} ${res.name.last}`}</p>
								<p>{res.cell}</p>
							</div>
						);
					} else {
						return (
							<div className="item" key={key}>
								<p>{`${res.name.first} ${res.name.last}`}</p>
								<p>{res.cell}</p>
							</div>
						);
					}
				})}
				<div className="loading">{loading ? 'Loading...' : null}</div>
			</div>
		</div>
	);
};

export default InfiniteScroll;
