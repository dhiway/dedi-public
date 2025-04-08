export function timeAgo(updatedAt: string): string {
    const updatedDate = new Date(updatedAt);
    const currentDate = new Date();
    
    const timeDiff = currentDate.getTime() - updatedDate.getTime();
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysAgo === 0) {
        return "Today";
    } else if (daysAgo === 1) {
        return "Yesterday";
    } else {
        return `${daysAgo} days ago`;
    }
}

export function normalization(inputString:string){
    const cleanString = inputString.replace(/[_-]/g, ' ');
    const stringList = cleanString.split(" ");
    const normalizedList = stringList.map((key)=> {
            return key.charAt(0).toUpperCase() + key.slice(1);
        });
    return normalizedList.toString().replace(/,/g," ");
}