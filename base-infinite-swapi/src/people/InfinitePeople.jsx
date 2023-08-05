import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  //fetchNextPage: 다음 페이지를 fetch 할 수 있다.
  // fetchPreviousPage: 이전 페이지를 fetch 할 수 있다.
  // isFetchingNextPage: fetchNextPage 메서드가 다음 페이지를 가져오는 동안 true이다.
  // isFetchingPreviousPage: fetchPreviousPage 메서드가 이전 페이지를 가져오는 동안 true이다.
  // hasNextPage: 가져올 수 있는 다음 페이지가 있을 경우 true이다.
  // hasPreviousPage: 가져올 수 있는 이전 페이지가 있을 경우 true이다.
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetching,
  } = useInfiniteQuery(
    "sw-people",
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      // getNextPageParam을 이용해서 페이지를 증가시킬 수 있다.
      // getNextPageParam의 첫 번째 인자 lastPage는 fetch 해온 가장 최근에 가져온 페이지 목록이다.
      // 두 번째 인자 allPages는 현재까지 가져온 모든 페이지 데이터이다.
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  );

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>Error! {error.toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
