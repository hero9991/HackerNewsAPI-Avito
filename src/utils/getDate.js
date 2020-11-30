
export const getDateOfStory = (time) => {
    const d = new Date(time * 1000);
    return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear() + '  '
        + (d.getHours().toString().length === 1
            ? ('0' + d.getHours())
            : d.getHours()) + ':'
        + (d.getMinutes().toString().length === 1
            ? ('0' + d.getMinutes())
            : d.getMinutes())
}

export const getDiffOfDate = (time) => {
    const diff = +new Date() - time * 1000;
    const d = new Date(diff);
    const years = d.getFullYear() - 1970;
    const month = d.getMonth();
    const date = d.getDate() - 1;
    const hours = d.getHours() - 3;
    const minutes = d.getMinutes();
    const seconds = d.getSeconds()
    return (years && (years === 1 ? `${years} year ago` : `${years} years ago`))
        || (month && (month === 1 ? `${month} month ago` : `${month} months ago`))
        || (date && (date === 1 ? `${date} day ago` : `${date} days ago`))
        || (hours && (hours === 1 ? `${hours} hour ago` : `${hours} hours ago`))
        || (minutes && (minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`))
        || (seconds && (seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`))
}