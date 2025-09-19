export class MovieDto {
  title: string;
  release_date: string;
  adult: boolean;

  constructor(title: string, release_date: string, adult: boolean) {
    this.title = title;
    this.release_date = release_date;
    this.adult = adult;
  }
}
