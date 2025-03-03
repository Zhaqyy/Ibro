import {useEffect, useState} from 'react';


const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await fetch(url);
          const json = await res.json();
          
          // Handle Strapi v5 response structure
          if (json.data) {
            // For collection types
            setData(json.data.docs || json.data);
          } else {
            setData(null);
          }
          
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [url]);
  
    return { loading, error, data };
  };

export default useFetch