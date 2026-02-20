cd ./dice

# Run cargo tests
cargo test

# Check if the tests were successful
if [ $? -eq 0 ]; then
    echo "No tests failed"
    
    RUSTFLAGS="-C target-feature=+atomics,+bulk-memory,+mutable-globals" \
    worker_count=navigator.hardwareConcurrency \
    cargo +nightly build --release \
    --target wasm32-unknown-unknown \
    -Z build-std=panic_abort,std

    wasm-bindgen --target web \
      --out-dir ../../frontend/public \
      --no-typescript \
      --enable-threads \
      ../target/wasm32-unknown-unknown/release/dice.wasm

    wasm-opt ../../frontend/public/dice.wasm \
      -o ../../frontend/public/dice_bg.wasm \
      -Oz \
      --enable-bulk-memory \
      --enable-atomics \
      --enable-sign-ext \
      --enable-threads \
      --enable-nontrapping-float-to-int

    find ../../frontend/public/snippets -name "workerHelpers.js" -exec sed -i 's|import('\''../../..'\'')|import('\''../../../dice.js'\'')|g' {} +

    echo "Next.js path fix applied"
    echo "Build successful"


else
    echo "Tests failed. Run `cargo test` to see which tests failed."
fi