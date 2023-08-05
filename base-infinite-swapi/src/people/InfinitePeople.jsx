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
      {/* 페이지를 처음 열면 사용자 정보가 없으므로 로딩 중입니다. (isLoading: true, isFetching: true)
      사용자 정보를 성공적으로 불러오면 로딩이 완료됩니다. (isLoading: false, isFetching: false)
      사용자가 다른 정보를 계속 찾는 상태에서는, 데이터를 계속 가져오고 있으므로 fetching 상태가 됩니다. (isLoading: false, isFetching: true)
      즉, isLoading은 "지금 로딩 중인가?"를 묻는 것이고, isFetching은 "데이터를 계속 찾고 있는 중인가?"를 묻는 것입니다. */}
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
