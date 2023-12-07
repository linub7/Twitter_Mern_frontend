import { IoSearchOutline } from 'react-icons/io5';

import styles from './styles.module.css';

const SearchBarContainer = ({
  placeholder,
  value,
  setSearchTerm = () => {},
}) => {
  return (
    <div className={styles.searchBarContainer}>
      <IoSearchOutline size={25} />
      <input
        type="text"
        value={value}
        className={styles.searchBox}
        placeholder={placeholder}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBarContainer;
