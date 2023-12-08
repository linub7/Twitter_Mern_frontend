export const getImageSource = (img) =>
  img ? img : require('../assets/images/def-user.jpg');

export const timeDifference = (current, previous) => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return 'Just now';

    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
};

export const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const sortPinnedItems = (items) => {
  return items.filter((item) => item.pinned === true);
};

const sortUnpinnedItems = (items) => {
  return items.filter((item) => item.pinned !== true);
};

export const sortItems = (items, isPinned) => {
  const pinnedItems = sortPinnedItems(items);
  const unpinnedItems = sortUnpinnedItems(items);

  return isPinned
    ? pinnedItems.concat(unpinnedItems)
    : unpinnedItems.concat(pinnedItems);
};

export const getChatName = (chatData, userLoggedInId) => {
  let chatName = chatData?.chatName;
  if (!chatName) {
    const otherChatUsers = getOtherChatUsers(chatData?.users, userLoggedInId);
    const namesArray = otherChatUsers?.map(
      (user) => `${user?.firstName} ${user?.lastName}`
    );

    chatName = namesArray.join(', ');
  }

  return chatName;
};

export const getChatImageElements = (chatData, userLoggedInId) => {
  let images = [];
  const otherChatUsers = getOtherChatUsers(chatData?.users, userLoggedInId);
  images?.push(getUserChatImageElement(otherChatUsers[0]));

  if (otherChatUsers?.length > 1) {
    images?.push(getUserChatImageElement(otherChatUsers[1]));
  }

  return images;
};

export const getChatOtherUserId = (users, loggedInUserId) => {
  return users[0]?._id?.toString() === loggedInUserId?.toString()
    ? users[1]?._id
    : users[0]?._id;
};

const getOtherChatUsers = (users, userLoggedInId) => {
  if (users?.length === 1) return users;

  return users?.filter((item) => item?._id !== userLoggedInId);
};

const getUserChatImageElement = (user) => {
  return getImageSource(user?.profilePic?.url);
};
