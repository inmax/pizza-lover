import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import InfiniteScroll from "react-infinite-scroller";
import Loadable from "react-loadable";
import get from "lodash/get";

const Loading = () => <p>Loading...</p>;
const Photo = Loadable({
  loader: () => import("components/Photo"),
  loading: Loading
});

const Album = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pagination, setPagination] = useState(0);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState();
  const LIMIT = 5;

  const imageRenderer = ({ index, left, top, key, photo }) => (
    <Photo
      key={key}
      index={index}
      photo={photo}
      left={left}
      top={top}
      onClick={openLightbox}
    />
  );

const parseData=(arrayData)=>{
  if(!Array.isArray(arrayData)) return null;
  return arrayData.map((photoData)=>{
    return {
      src: get(photoData, "images.downsized_large.url"),
      width: get(photoData, "images.downsized_large.width"),
      height: get(photoData, "images.downsized_large.height"),
      title: get(photoData, "title")
    }
  });
};
  /* API fetch */
  const getPhotos = async pag => {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=svM9aKGJwmCsZrHm3rgnGLSZEMsgZtUQ&q=pizza&limit=5&offset=${LIMIT *
      pag}&rating=G&lang=en"`;

    await fetch(url)
      .then(res => res.json())
      .then(
        result => {
          setIsLoaded(true);
          const newItems = [
            ...items,
           ... parseData(result.data)
          ];
          if (get(result, "pagination.total_count") !== total) {
            setTotal(get(result, "pagination.total_count"));
          }
          setItems(newItems);
        },
        // Nota: es importante manejar errores aquí y no en
        // un bloque catch() para que no interceptemos errores
        // de errores reales en los componentes.
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(
    () => {
      //función que define el efecto SECUNDARIO
      getPhotos(pagination);
    },
    [pagination]
  );

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const openLightbox = useCallback((event, { photo, index }) => {
    console.log("open");
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...lllllllllllls</div>;
  } else {
    return (
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={pagination => {
            getPhotos(pagination);
          }}
          hasMore={total > pagination * LIMIT}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
        >
          <Gallery
            photos={items}
            direction={"column"}
            renderImage={imageRenderer}
          />
        </InfiniteScroll>
        <ModalGateway>
          {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
              <Carousel
                currentIndex={currentImage}
                views={items.map(x => ({
                  ...x,
                  srcset: x.srcSet,
                  caption: x.title
                }))}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </div>
    );
  }
};

export default Album;
