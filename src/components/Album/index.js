import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
// import Photo from "components/Photo";
import InfiniteScroll from "react-infinite-scroller";
import Loadable from "react-loadable";

function Loading() {
    return <h3>Loading...</h3>;
}

const Photo = Loadable({
    loader: () => import('components/Photo'),
    loading:Loading,
});

const Album = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pagination, setPagination] = useState(0);
  const [items, setItems] = useState([]);
  const [totalPhoto, setTotal]=useState();
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

  /* API fetch ***************************************************************************/
  const getPhotos = async pag => {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=svM9aKGJwmCsZrHm3rgnGLSZEMsgZtUQ&q=pizza&limit=5&offset=${LIMIT *
      pag}&rating=G&lang=en"`;

    await fetch(url)
      .then(res => res.json())
      .then(
        result => {
          setIsLoaded(true);
          console.log(result);
          const { albums } = result;
          const newItems = [
            ...items,
            {
              src: result.data[0].images.original_still.url,
              width: result.data[0].images.original_still.width,
              height: result.data[0].images.original_still.height,
              title: "1"
            },
            {
              src: result.data[1].images.downsized_large.url,
              width: result.data[1].images.downsized_large.width,
              height: result.data[1].images.downsized_large.height,
              title: "2"
            },
            {
              src: result.data[2].images.downsized_large.url,
              width: result.data[2].images.downsized_large.width,
              height: result.data[2].images.downsized_large.height,
              title: "3"
            },
            {
              src: result.data[3].images.downsized_large.url,
              width: result.data[3].images.downsized_large.width,
              height: result.data[3].images.downsized_large.height,
              title: "4"
            },
            {
              src: result.data[4].images.downsized_large.url,
              width: result.data[4].images.downsized_large.width,
              height: result.data[4].images.downsized_large.height,
              title: "5"
            }
          ];
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
  //   const openLightbox = (event, { photo, index }) => {
  //   console.log('asdfasf')
  //     setCurrentImage(index);
  //     setViewerIsOpen(true);
  //   };
  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...lllllllllllls</div>;
  } else {
    //return "aaaaa"
    return (
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={pagination => {
            getPhotos(pagination);
          }}
          hasMore={true}
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
