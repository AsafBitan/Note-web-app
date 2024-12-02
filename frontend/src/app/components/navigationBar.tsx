import React from 'react';
import styles from '../page.module.css';

interface NavBarProps {
  pages: number[];
  activePage: number;
  totalPages: number;
  setActivePage: React.Dispatch<React.SetStateAction<number>>;
}

const NavBar: React.FC<NavBarProps> = ({ pages, activePage, totalPages, setActivePage }) => {
  function goToFirstPage() {
    setActivePage(1);
  }

  const goToPrevPage = () => {
    setActivePage((prevPage: number) => Math.max(prevPage - 1, 1));
  };

  function goToPage(index: number) {
    setActivePage(index);
  }

  function goToNextPage() {
    setActivePage((nextPage: number) => Math.min(nextPage + 1, totalPages));
  }

  function goToLastPage() {
    setActivePage(totalPages);
  }

  return (
    <div>
      <button className={styles.button} name="first" onClick={goToFirstPage}>
        First
      </button>
      <button className={styles.button} name="previous" onClick={goToPrevPage}>
        Previous
      </button>
      {pages.map((i) => (
        <button
          key={i}
          className={`${styles.button} ${activePage === i ? styles.boldButton : ""}`}
          name={"page" + "-" + i}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      ))}
      <button className={styles.button} name="next" onClick={goToNextPage}>
        Next
      </button>
      <button className={styles.button} name="last" onClick={goToLastPage}>
        Last
      </button>
    </div>
  );
};

export default NavBar;
