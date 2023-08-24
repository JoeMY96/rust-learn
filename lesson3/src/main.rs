fn bubble_sort<T: PartialOrd + Copy>(arr: &mut [T]) {
    for i in 0..arr.len() {
        for j in 0..arr.len() - i - 1 {
            if arr[j] > arr[j + 1] {
                (arr[j], arr[j + 1]) = (arr[j + 1], arr[j])

            }
        }
    }
}

fn main() {
    let mut numbers = vec![1, 5, 8, 10, 2];
    bubble_sort(&mut numbers);
    println!("{:?}", numbers);
}
