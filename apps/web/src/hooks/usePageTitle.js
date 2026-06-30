import { useEffect } from "react";

const BASE_TITLE = "College Dakhla - India's #1 Admission Platform";

const usePageTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${BASE_TITLE}`;
    } else {
      document.title = BASE_TITLE;
    }

    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
};

export default usePageTitle;
